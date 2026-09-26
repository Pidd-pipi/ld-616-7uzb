import { seed } from "../seed";
import type { MeasuringDevice } from "../models/MeasuringDevice";

const rows: MeasuringDevice[] = seed.measuringDevice.map((row) => ({ ...row }));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const measuringDeviceRepository = {
  findAll: () => rows,
  findById: (id: number) => rows.find((row) => row.id === id) ?? null,
  save: (row: Omit<MeasuringDevice, "id">) => {
    const created: MeasuringDevice = { id: nextId(), ...row };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<MeasuringDevice>) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
