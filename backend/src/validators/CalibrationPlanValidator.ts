import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { toDateKey } from "../utils/formatters";
import type { CalibrationPlanAssignPayload, CalibrationPlanPayload, CalibrationPlanReschedulePayload } from "../types/CalibrationPlanPayload";

const badRequest = (message: string): never => {
  throw { status: 400, code: ERROR_CODES.VALIDATION_FAILED, message: `${ERROR_MESSAGES.VALIDATION_FAILED}: ${message}` };
};

export const validatePlanCreatePayload = (body: unknown): CalibrationPlanPayload => {
  const payload = (body ?? {}) as Partial<CalibrationPlanPayload>;
  if (!Number.isFinite(Number(payload.device_id))) badRequest("device_id is required and must be a number");
  if (!toDateKey(payload.planned_date)) badRequest("planned_date is required and must be a valid date");
  return {
    device_id: Number(payload.device_id),
    planned_date: String(payload.planned_date),
    plan_type: payload.plan_type,
    priority: payload.priority
  };
};

export const validatePlanReschedulePayload = (body: unknown): CalibrationPlanReschedulePayload => {
  const payload = (body ?? {}) as Partial<CalibrationPlanReschedulePayload>;
  if (!toDateKey(payload.planned_date)) badRequest("planned_date is required and must be a valid date");
  return { planned_date: String(payload.planned_date) };
};

export const validatePlanAssignPayload = (body: unknown): CalibrationPlanAssignPayload => {
  const payload = (body ?? {}) as Partial<CalibrationPlanAssignPayload>;
  if (!Number.isFinite(Number(payload.vendor_id))) badRequest("vendor_id is required and must be a number");
  return { vendor_id: Number(payload.vendor_id) };
};
