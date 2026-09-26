import type { OverdueAlertLevel } from "../constants/OverdueAlertLevel";
import type { OverdueAlertStatus } from "../constants/OverdueAlertStatus";
export interface OverdueAlert { id: number; device_id: number; plan_id: number; alert_level: OverdueAlertLevel; alert_reason: string; handled_by: string | null; handled_at: string | null; status: OverdueAlertStatus }
