import { calibrationVendorRepository } from "../repositories/CalibrationVendorRepository";
import { createCalibrationVendorDto } from "../constructors/CalibrationVendorDtoFactory";
import type { CalibrationVendorPayload } from "../types/CalibrationVendorPayload";

export const calibrationVendorService = {
  list: () => calibrationVendorRepository.findAll(),
  create: (payload: CalibrationVendorPayload) => {
    const { id: _id, ...row } = createCalibrationVendorDto({
      vendor_name: payload.vendor_name,
      qualification_no: payload.qualification_no ?? "",
      contact_phone: payload.contact_phone ?? "",
      service_scope: payload.service_scope ?? ""
    });
    return calibrationVendorRepository.save(row);
  }
};
