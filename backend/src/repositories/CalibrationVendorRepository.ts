import { seed } from "../seed";
import type { CalibrationVendor } from "../models/CalibrationVendor";

const rows: CalibrationVendor[] = seed.calibrationVendor.map((row) => ({ ...row }));
let seq = rows.reduce((max, row) => Math.max(max, row.id), 0);

export const calibrationVendorRepository = {
  findAll: (): CalibrationVendor[] => rows,
  findById: (id: number): CalibrationVendor | null => rows.find((row) => row.id === id) ?? null,
  save: (row: CalibrationVendor): CalibrationVendor => {
    const created = { ...row, id: ++seq };
    rows.push(created);
    return created;
  }
};
