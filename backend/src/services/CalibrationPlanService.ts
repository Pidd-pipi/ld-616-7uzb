import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { overdueAlertService } from "./OverdueAlertService";
import { PlanStatus } from "../constants/PlanStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createCalibrationPlanDto } from "../constructors/CalibrationPlanDtoFactory";
import { toDateKey } from "../utils/formatters";
import type {
  CalibrationPlanCreatePayload,
  CalibrationPlanReschedulePayload,
  CalibrationPlanAssignPayload
} from "../types/CalibrationPlanPayload";
import type { CalibrationPlan } from "../models/CalibrationPlan";

const UNFINISHED_STATUSES: readonly PlanStatus[] = ["PLANNED", "ASSIGNED", "IN_PROGRESS", "CERT_UPLOADED"];

const findDateConflict = (deviceId: number, plannedDate: string, excludePlanId?: number) => {
  const dateKey = toDateKey(plannedDate);
  return (
    calibrationPlanRepository
      .findByDeviceId(deviceId)
      .find(
        (plan) =>
          plan.id !== excludePlanId &&
          UNFINISHED_STATUSES.includes(plan.status) &&
          toDateKey(plan.planned_date) === dateKey
      ) ?? null
  );
};

const dateConflictError = (conflictPlan: CalibrationPlan) => ({
  status: 409,
  code: ERROR_CODES.PLAN_DATE_CONFLICT,
  message: ERROR_MESSAGES.PLAN_DATE_CONFLICT(conflictPlan.id),
  details: { conflictPlan }
});

export const calibrationPlanService = {
  list: () => calibrationPlanRepository.findAll(),

  create: (payload: CalibrationPlanCreatePayload, actor: string) => {
    const device = measuringDeviceRepository.findById(Number(payload.device_id));
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: ERROR_MESSAGES.DEVICE_NOT_FOUND };
    }
    if (!payload.planned_date) {
      throw { status: 400, code: ERROR_CODES.VALIDATION_FAILED, message: ERROR_MESSAGES.VALIDATION_FAILED };
    }
    const conflict = findDateConflict(device.id, payload.planned_date);
    if (conflict) {
      console.info(LOG_TEMPLATES.CalibrationPlan.conflict, "plan_date_conflict", conflict.id, "actor", actor);
      throw dateConflictError(conflict);
    }
    const { id: _id, ...row } = createCalibrationPlanDto({
      device_id: device.id,
      planned_date: payload.planned_date,
      plan_type: payload.plan_type ?? "PERIODIC",
      priority: payload.priority ?? "NORMAL",
      status: "PLANNED",
      assigned_vendor_id: null,
      created_by: actor
    });
    const created = calibrationPlanRepository.save(row);
    console.info(LOG_TEMPLATES.CalibrationPlan.create, created.id, "actor", actor);
    return created;
  },

  reschedule: (id: number, payload: CalibrationPlanReschedulePayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(id);
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: ERROR_MESSAGES.PLAN_NOT_FOUND };
    }
    if (!payload.planned_date) {
      throw { status: 400, code: ERROR_CODES.VALIDATION_FAILED, message: ERROR_MESSAGES.VALIDATION_FAILED };
    }
    const conflict = findDateConflict(plan.device_id, payload.planned_date, plan.id);
    if (conflict) {
      console.info(LOG_TEMPLATES.CalibrationPlan.conflict, "plan_date_conflict", conflict.id, "actor", actor);
      throw dateConflictError(conflict);
    }
    const updated = calibrationPlanRepository.update(plan.id, { planned_date: payload.planned_date })!;
    console.info(LOG_TEMPLATES.CalibrationPlan.reschedule, updated.id, "actor", actor);
    return updated;
  },

  assign: (id: number, payload: CalibrationPlanAssignPayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(id);
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: ERROR_MESSAGES.PLAN_NOT_FOUND };
    }
    const vendor = calibrationVendorRepository.findById(Number(payload.vendor_id));
    if (!vendor) {
      throw { status: 404, code: ERROR_CODES.VENDOR_NOT_FOUND, message: ERROR_MESSAGES.VENDOR_NOT_FOUND };
    }
    if (vendor.vendor_status !== "ACTIVE") {
      throw { status: 409, code: ERROR_CODES.VENDOR_DISABLED, message: ERROR_MESSAGES.VENDOR_DISABLED };
    }
    const device = measuringDeviceRepository.findById(plan.device_id);
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: ERROR_MESSAGES.DEVICE_NOT_FOUND };
    }
    const scopes = vendor.service_scope.split(",").map((scope) => scope.trim()).filter(Boolean);
    if (!scopes.includes(device.device_type)) {
      throw {
        status: 409,
        code: ERROR_CODES.VENDOR_SCOPE_MISMATCH,
        message: ERROR_MESSAGES.VENDOR_SCOPE_MISMATCH,
        details: { device_type: device.device_type, service_scope: scopes }
      };
    }
    const updated = calibrationPlanRepository.update(plan.id, {
      status: "ASSIGNED",
      assigned_vendor_id: vendor.id
    })!;
    const alert = overdueAlertService.createPendingForPlan(updated, vendor);
    console.info(LOG_TEMPLATES.CalibrationPlan.assign, updated.id, "vendor", vendor.id, "actor", actor);
    return { plan: updated, alert };
  }
};
