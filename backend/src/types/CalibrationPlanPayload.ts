export interface CalibrationPlanCreatePayload {
  device_id: number;
  planned_date: string;
  plan_type?: string;
  priority?: string;
}

export interface CalibrationPlanReschedulePayload {
  planned_date: string;
}

export interface CalibrationPlanAssignPayload {
  vendor_id: number;
}

export type CalibrationPlanPayload = CalibrationPlanCreatePayload;
