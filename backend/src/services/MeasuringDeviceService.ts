import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { createMeasuringDeviceDto } from "../constructors/MeasuringDeviceDtoFactory";
import type { MeasuringDevicePayload } from "../types/MeasuringDevicePayload";

export const measuringDeviceService = {
  list: () => measuringDeviceRepository.findAll(),
  create: (payload: MeasuringDevicePayload) => {
    const { id: _id, ...row } = createMeasuringDeviceDto({
      device_code: payload.device_code,
      name: payload.name,
      device_type: payload.device_type,
      accuracy_level: payload.accuracy_level ?? "",
      owner_dept: payload.owner_dept ?? "",
      calibration_cycle_days: Number(payload.calibration_cycle_days ?? 365)
    });
    return measuringDeviceRepository.save(row);
  }
};
