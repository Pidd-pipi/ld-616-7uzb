export interface OverdueAlertPayload {
  device_id: number;
  plan_id: number;
  alert_level?: string;
  alert_reason?: string;
}
