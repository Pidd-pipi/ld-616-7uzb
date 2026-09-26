export const ALERT_TEXT = {
  PLAN_ASSIGNED: (planId: number, vendorId: number) => `计划#${planId}已派发机构#${vendorId}，等待证书回收`,
} as const;
