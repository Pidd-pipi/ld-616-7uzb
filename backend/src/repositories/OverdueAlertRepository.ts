import { seed } from "../seed";
import type { OverdueAlert } from "../models/OverdueAlert";
import { isAlertPending } from "../constants/OverdueAlertStatus";

const rows: OverdueAlert[] = seed.overdueAlert.map((row) => ({ ...row }));
let seq = rows.reduce((max, row) => Math.max(max, row.id), 0);

export const overdueAlertRepository = {
  findAll: (): OverdueAlert[] => rows,
  findById: (id: number): OverdueAlert | null => rows.find((row) => row.id === id) ?? null,
  findPendingByPlanId: (planId: number): OverdueAlert[] => rows.filter((row) => row.plan_id === planId && isAlertPending(row.status)),
  save: (row: OverdueAlert): OverdueAlert => {
    const created = { ...row, id: ++seq };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<OverdueAlert>): OverdueAlert | null => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
