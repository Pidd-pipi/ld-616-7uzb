import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { isVendorActive } from "../constants/CalibrationVendorStatus";
import type { CalibrationVendor } from "../models/CalibrationVendor";

export const calibrationVendorService = {
  list: () => calibrationVendorRepository.findAll(),
  create: (row: CalibrationVendor) => calibrationVendorRepository.save(row),
  getById: (id: number) => calibrationVendorRepository.findById(id),
  isAssignable: (vendor: CalibrationVendor): boolean => isVendorActive(vendor.vendor_status),
  coversDeviceType: (vendor: CalibrationVendor, deviceType: string): boolean =>
    vendor.service_scope.split(",").map((scope) => scope.trim()).filter(Boolean).includes(deviceType)
};
