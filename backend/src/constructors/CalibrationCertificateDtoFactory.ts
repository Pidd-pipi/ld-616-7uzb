import type { CalibrationCertificate } from "../models/CalibrationCertificate";
export const createCalibrationCertificateDto = (overrides: Partial<CalibrationCertificate> = {}): CalibrationCertificate => ({ id: 0, device_id: 0, plan_id: 0, certificate_no: "", result_status: "PASS", valid_until: "1970-01-01", file_path: "", issued_by: "system", ...overrides });
