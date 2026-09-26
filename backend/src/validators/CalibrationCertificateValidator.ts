import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { CertificateResult } from "../constants/CertificateResult";
import { toDateKey } from "../utils/formatters";
import type { CalibrationCertificatePayload } from "../types/CalibrationCertificatePayload";

const badRequest = (message: string): never => {
  throw { status: 400, code: ERROR_CODES.VALIDATION_FAILED, message: `${ERROR_MESSAGES.VALIDATION_FAILED}: ${message}` };
};

export const validateCertificateCreatePayload = (body: unknown): CalibrationCertificatePayload => {
  const payload = (body ?? {}) as Partial<CalibrationCertificatePayload>;
  if (!Number.isFinite(Number(payload.plan_id))) badRequest("plan_id is required and must be a number");
  if (typeof payload.certificate_no !== "string" || payload.certificate_no.trim() === "") badRequest("certificate_no is required");
  if (typeof payload.result_status !== "string" || !(CertificateResult as readonly string[]).includes(payload.result_status)) {
    badRequest(`result_status must be one of ${CertificateResult.join("/")}`);
  }
  if (!toDateKey(payload.valid_until)) badRequest("valid_until is required and must be a valid date");
  return {
    plan_id: Number(payload.plan_id),
    certificate_no: String(payload.certificate_no),
    result_status: String(payload.result_status),
    valid_until: String(payload.valid_until),
    file_path: payload.file_path,
    issued_by: payload.issued_by
  };
};
