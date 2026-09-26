import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import type { MeasuringDevice } from "../models/MeasuringDevice";

export const measuringDeviceService = {
  list: () => measuringDeviceRepository.findAll(),
  create: (row: MeasuringDevice) => measuringDeviceRepository.save(row),
  getById: (id: number) => measuringDeviceRepository.findById(id)
};
