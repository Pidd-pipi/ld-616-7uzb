import { seed } from "../seed";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import { isOpenPlanStatus } from "../constants/PlanStatus";
import { toDateKey } from "../utils/formatters";

const rows: CalibrationPlan[] = seed.calibrationPlan.map((row) => ({ ...row }));
let seq = rows.reduce((max, row) => Math.max(max, row.id), 0);

export const calibrationPlanRepository = {
  findAll: (): CalibrationPlan[] => rows,
  findById: (id: number): CalibrationPlan | null => rows.find((row) => row.id === id) ?? null,
  findOpenConflict: (deviceId: number, plannedDate: string, excludeId?: number): CalibrationPlan | null => {
    const key = toDateKey(plannedDate);
    return rows.find((row) => row.id !== excludeId && row.device_id === deviceId && isOpenPlanStatus(row.status) && toDateKey(row.planned_date) === key) ?? null;
  },
  save: (row: CalibrationPlan): CalibrationPlan => {
    const created = { ...row, id: ++seq };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<CalibrationPlan>): CalibrationPlan | null => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
