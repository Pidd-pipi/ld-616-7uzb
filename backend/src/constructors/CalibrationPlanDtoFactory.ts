import type { CalibrationPlan } from "../models/CalibrationPlan";
export const createCalibrationPlanDto = (overrides: Partial<CalibrationPlan> = {}): CalibrationPlan => ({ id: 0, device_id: 0, planned_date: "1970-01-01", plan_type: "PERIODIC", priority: "NORMAL", status: "PLANNED", assigned_vendor_id: null, created_by: "system", ...overrides });
