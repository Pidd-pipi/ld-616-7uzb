export const OverdueAlertStatus = ["PENDING","CLOSED"] as const;
export type OverdueAlertStatus = (typeof OverdueAlertStatus)[number];
export const ALERT_STATUS_PENDING: OverdueAlertStatus = "PENDING";
export const ALERT_STATUS_CLOSED: OverdueAlertStatus = "CLOSED";
export const isAlertPending = (status: string): boolean => status === ALERT_STATUS_PENDING;
