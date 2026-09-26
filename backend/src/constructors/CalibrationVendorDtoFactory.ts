import type { CalibrationVendor } from "../models/CalibrationVendor";

export const createCalibrationVendorDto = (overrides: Partial<CalibrationVendor> = {}): CalibrationVendor => ({
  id: 0,
  vendor_name: "",
  qualification_no: "",
  contact_phone: "",
  service_scope: "",
  vendor_status: "ACTIVE",
  ...overrides
});
