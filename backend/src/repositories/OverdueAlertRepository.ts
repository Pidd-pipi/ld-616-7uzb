import { seed } from "../seed";
import type { OverdueAlert } from "../models/OverdueAlert";

const rows: OverdueAlert[] = seed.overdueAlert.map((row) => ({ ...row }));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const overdueAlertRepository = {
  findAll: () => rows,
  findById: (id: number) => rows.find((row) => row.id === id) ?? null,
  findByPlanId: (planId: number) => rows.filter((row) => row.plan_id === planId),
  save: (row: Omit<OverdueAlert, "id">) => {
    const created: OverdueAlert = { id: nextId(), ...row };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<OverdueAlert>) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }
};
