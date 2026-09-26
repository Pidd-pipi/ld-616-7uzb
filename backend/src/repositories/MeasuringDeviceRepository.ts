import { seed } from "../seed";
import type { MeasuringDevice } from "../models/MeasuringDevice";

const rows: MeasuringDevice[] = seed.measuringDevice.map((row) => ({ ...row }));
let seq = rows.reduce((max, row) => Math.max(max, row.id), 0);

export const measuringDeviceRepository = {
  findAll: (): MeasuringDevice[] => rows,
  findById: (id: number): MeasuringDevice | null => rows.find((row) => row.id === id) ?? null,
  save: (row: MeasuringDevice): MeasuringDevice => {
    const created = { ...row, id: ++seq };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<MeasuringDevice>): MeasuringDevice | null => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
