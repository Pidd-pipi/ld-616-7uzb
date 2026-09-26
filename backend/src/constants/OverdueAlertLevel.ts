export const OverdueAlertLevel = ["LOW","MEDIUM","HIGH"] as const;
export type OverdueAlertLevel = (typeof OverdueAlertLevel)[number];
export const ALERT_LEVEL_ON_ASSIGN: OverdueAlertLevel = "MEDIUM";
