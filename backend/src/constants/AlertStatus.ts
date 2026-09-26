export const AlertStatus = ["PENDING", "CLOSED"] as const;
export type AlertStatus = (typeof AlertStatus)[number];
