import { seed } from "../seed";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";

const rows: CalibrationCertificate[] = seed.calibrationCertificate.map((row) => ({ ...row }));
let seq = rows.reduce((max, row) => Math.max(max, row.id), 0);

export const calibrationCertificateRepository = {
  findAll: (): CalibrationCertificate[] => rows,
  findById: (id: number): CalibrationCertificate | null => rows.find((row) => row.id === id) ?? null,
  save: (row: CalibrationCertificate): CalibrationCertificate => {
    const created = { ...row, id: ++seq };
    rows.push(created);
    return created;
  }
};
