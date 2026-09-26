export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  DEVICE_NOT_FOUND: "measuring device not found",
  PLAN_NOT_FOUND: "calibration plan not found",
  PLAN_NOT_OPEN: "plan is already closed or cancelled and cannot be rescheduled",
  PLAN_DATE_CONFLICT: "device already has an open plan on the same date",
  PLAN_NOT_ASSIGNABLE: "only PLANNED plans can be assigned to a vendor",
  PLAN_NOT_ASSIGNED: "certificate registration requires an ASSIGNED plan",
  VENDOR_NOT_FOUND: "calibration vendor not found",
  VENDOR_DISABLED: "calibration vendor is disabled and cannot take plans",
  VENDOR_SCOPE_MISMATCH: "vendor qualification scope does not cover the device type"
};
