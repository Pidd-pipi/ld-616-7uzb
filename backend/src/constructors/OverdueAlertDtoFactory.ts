import type { OverdueAlert } from "../models/OverdueAlert";
export const createOverdueAlertDto = (overrides: Partial<OverdueAlert> = {}): OverdueAlert => ({ id: 0, device_id: 0, plan_id: 0, alert_level: "MEDIUM", alert_reason: "", handled_by: null, handled_at: null, status: "PENDING", ...overrides });
