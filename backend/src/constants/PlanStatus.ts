export const PlanStatus = ["PLANNED","ASSIGNED","IN_PROGRESS","CERT_UPLOADED","CLOSED","CANCELLED"] as const;
export type PlanStatus = (typeof PlanStatus)[number];
export const CLOSED_PLAN_STATUSES: readonly PlanStatus[] = ["CLOSED", "CANCELLED"];
export const isOpenPlanStatus = (status: string): boolean => !(CLOSED_PLAN_STATUSES as readonly string[]).includes(status);
