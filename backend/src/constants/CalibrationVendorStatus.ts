export const CalibrationVendorStatus = ["ACTIVE","DISABLED"] as const;
export type CalibrationVendorStatus = (typeof CalibrationVendorStatus)[number];
export const VENDOR_STATUS_ACTIVE: CalibrationVendorStatus = "ACTIVE";
export const isVendorActive = (status: string): boolean => status === VENDOR_STATUS_ACTIVE;
