import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { overdueAlertRepository } from "../repositories/OverdueAlertRepository";
import { calibrationVendorService } from "./CalibrationVendorService";
import { createCalibrationPlanDto } from "../constructors/CalibrationPlanDtoFactory";
import { createOverdueAlertDto } from "../constructors/OverdueAlertDtoFactory";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { isOpenPlanStatus } from "../constants/PlanStatus";
import { ALERT_LEVEL_ON_ASSIGN } from "../constants/OverdueAlertLevel";
import { toAuditTarget, toDateKey } from "../utils/formatters";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationPlanAssignPayload, CalibrationPlanPayload, CalibrationPlanReschedulePayload } from "../types/CalibrationPlanPayload";

const conflictDetails = (plan: CalibrationPlan) => ({
  conflict_plan: {
    id: plan.id,
    device_id: plan.device_id,
    planned_date: plan.planned_date,
    status: plan.status,
    assigned_vendor_id: plan.assigned_vendor_id
  }
});

const conflictMessage = (plan: CalibrationPlan) =>
  `${ERROR_MESSAGES.PLAN_DATE_CONFLICT}: plan #${plan.id} (device #${plan.device_id}, planned_date ${plan.planned_date}, status ${plan.status})`;

export const calibrationPlanService = {
  list: () => calibrationPlanRepository.findAll(),

  create: (payload: CalibrationPlanPayload, actor: string) => {
    const device = measuringDeviceRepository.findById(payload.device_id);
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: `${ERROR_MESSAGES.DEVICE_NOT_FOUND}: device #${payload.device_id}` };
    }
    const conflict = calibrationPlanRepository.findOpenConflict(device.id, payload.planned_date);
    if (conflict) {
      console.info(LOG_TEMPLATES.CalibrationPlan.conflict, toAuditTarget("CalibrationPlan", conflict.id), `actor=${actor}`);
      throw { status: 409, code: ERROR_CODES.PLAN_DATE_CONFLICT, message: conflictMessage(conflict), details: conflictDetails(conflict) };
    }
    const plan = calibrationPlanRepository.save(createCalibrationPlanDto({
      device_id: device.id,
      planned_date: toDateKey(payload.planned_date) as string,
      plan_type: payload.plan_type ?? "PERIODIC",
      priority: payload.priority ?? "NORMAL",
      status: "PLANNED",
      assigned_vendor_id: null,
      created_by: actor
    }));
    console.info(LOG_TEMPLATES.CalibrationPlan.create, toAuditTarget("CalibrationPlan", plan.id), `actor=${actor}`);
    return plan;
  },

  reschedule: (id: number, payload: CalibrationPlanReschedulePayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(id);
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: `${ERROR_MESSAGES.PLAN_NOT_FOUND}: plan #${id}` };
    }
    if (!isOpenPlanStatus(plan.status)) {
      throw { status: 409, code: ERROR_CODES.PLAN_NOT_OPEN, message: `${ERROR_MESSAGES.PLAN_NOT_OPEN}: plan #${plan.id} is ${plan.status}` };
    }
    const conflict = calibrationPlanRepository.findOpenConflict(plan.device_id, payload.planned_date, plan.id);
    if (conflict) {
      console.info(LOG_TEMPLATES.CalibrationPlan.conflict, toAuditTarget("CalibrationPlan", conflict.id), `actor=${actor}`);
      throw { status: 409, code: ERROR_CODES.PLAN_DATE_CONFLICT, message: conflictMessage(conflict), details: conflictDetails(conflict) };
    }
    const updated = calibrationPlanRepository.update(plan.id, { planned_date: toDateKey(payload.planned_date) as string });
    console.info(LOG_TEMPLATES.CalibrationPlan.reschedule, toAuditTarget("CalibrationPlan", plan.id), `actor=${actor}`);
    return updated;
  },

  assign: (id: number, payload: CalibrationPlanAssignPayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(id);
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: `${ERROR_MESSAGES.PLAN_NOT_FOUND}: plan #${id}` };
    }
    if (plan.status !== "PLANNED") {
      throw { status: 409, code: ERROR_CODES.PLAN_NOT_ASSIGNABLE, message: `${ERROR_MESSAGES.PLAN_NOT_ASSIGNABLE}: plan #${plan.id} is ${plan.status}` };
    }
    const device = measuringDeviceRepository.findById(plan.device_id);
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: `${ERROR_MESSAGES.DEVICE_NOT_FOUND}: device #${plan.device_id}` };
    }
    const vendor = calibrationVendorService.getById(payload.vendor_id);
    if (!vendor) {
      throw { status: 404, code: ERROR_CODES.VENDOR_NOT_FOUND, message: `${ERROR_MESSAGES.VENDOR_NOT_FOUND}: vendor #${payload.vendor_id}` };
    }
    if (!calibrationVendorService.isAssignable(vendor)) {
      throw { status: 409, code: ERROR_CODES.VENDOR_DISABLED, message: `${ERROR_MESSAGES.VENDOR_DISABLED}: vendor #${vendor.id} (${vendor.vendor_name}) is ${vendor.vendor_status}` };
    }
    if (!calibrationVendorService.coversDeviceType(vendor, device.device_type)) {
      throw { status: 409, code: ERROR_CODES.VENDOR_SCOPE_MISMATCH, message: `${ERROR_MESSAGES.VENDOR_SCOPE_MISMATCH}: vendor #${vendor.id} scope "${vendor.service_scope}" vs device type "${device.device_type}"` };
    }
    const updated = calibrationPlanRepository.update(plan.id, { assigned_vendor_id: vendor.id, status: "ASSIGNED" });
    console.info(LOG_TEMPLATES.CalibrationPlan.assign, toAuditTarget("CalibrationPlan", plan.id), `vendor=${vendor.id}`, `actor=${actor}`);
    const alert = overdueAlertRepository.save(createOverdueAlertDto({
      device_id: device.id,
      plan_id: plan.id,
      alert_level: ALERT_LEVEL_ON_ASSIGN,
      alert_reason: `plan #${plan.id} assigned to vendor #${vendor.id}, awaiting execution`,
      status: "PENDING",
      handled_by: null,
      handled_at: null
    }));
    console.info(LOG_TEMPLATES.OverdueAlert.autoCreate, toAuditTarget("OverdueAlert", alert.id), `plan=${plan.id}`);
    return { plan: updated, alert };
  }
};
