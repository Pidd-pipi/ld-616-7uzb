export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  DEVICE_NOT_FOUND: "设备不存在",
  PLAN_NOT_FOUND: "校准计划不存在",
  VENDOR_NOT_FOUND: "校准机构不存在",
  PLAN_DATE_CONFLICT: (planId: number | string) => `同一设备已存在同日期未完结计划#${planId}，请调整计划日期`,
  VENDOR_DISABLED: "校准机构已停用，禁止指派",
  VENDOR_SCOPE_MISMATCH: "校准机构资质范围不覆盖该设备类型，禁止指派",
  PLAN_NOT_ASSIGNED: "证书登记只接受已派发的校准计划"
};
