import { seed } from "../seed";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";

const rows: CalibrationCertificate[] = seed.calibrationCertificate.map((row) => ({ ...row }));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const calibrationCertificateRepository = {
  findAll: () => rows,
  findById: (id: number) => rows.find((row) => row.id === id) ?? null,
  findByPlanId: (planId: number) => rows.filter((row) => row.plan_id === planId),
  save: (row: Omit<CalibrationCertificate, "id">) => {
    const created: CalibrationCertificate = { id: nextId(), ...row };
    rows.push(created);
    return created;
  }
};
