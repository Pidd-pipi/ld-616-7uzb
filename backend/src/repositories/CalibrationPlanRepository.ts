import { seed } from "../seed";
import type { CalibrationPlan } from "../models/CalibrationPlan";

const rows: CalibrationPlan[] = seed.calibrationPlan.map((row) => ({ ...row }));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const calibrationPlanRepository = {
  findAll: () => rows,
  findById: (id: number) => rows.find((row) => row.id === id) ?? null,
  findByDeviceId: (deviceId: number) => rows.filter((row) => row.device_id === deviceId),
  save: (row: Omit<CalibrationPlan, "id">) => {
    const created: CalibrationPlan = { id: nextId(), ...row };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<CalibrationPlan>) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
