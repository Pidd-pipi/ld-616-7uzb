import { seed } from "../seed";
import type { CalibrationVendor } from "../models/CalibrationVendor";

const rows: CalibrationVendor[] = seed.calibrationVendor.map((row) => ({ ...row }));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const calibrationVendorRepository = {
  findAll: () => rows,
  findById: (id: number) => rows.find((row) => row.id === id) ?? null,
  save: (row: Omit<CalibrationVendor, "id">) => {
    const created: CalibrationVendor = { id: nextId(), ...row };
    rows.push(created);
    return created;
  }
};
