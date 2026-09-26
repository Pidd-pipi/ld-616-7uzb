import { calibrationCertificateRepository } from "../repositories/CalibrationCertificateRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { overdueAlertService } from "./OverdueAlertService";
import { createCalibrationCertificateDto } from "../constructors/CalibrationCertificateDtoFactory";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { isCertificatePass } from "../constants/CertificateResult";
import { DEVICE_STATUS_VALID } from "../constants/DeviceCalibrationStatus";
import { toAuditTarget, toDateKey } from "../utils/formatters";
import type { CertificateResult } from "../constants/CertificateResult";
import type { OverdueAlert } from "../models/OverdueAlert";
import type { CalibrationCertificatePayload } from "../types/CalibrationCertificatePayload";

export const calibrationCertificateService = {
  list: () => calibrationCertificateRepository.findAll(),

  create: (payload: CalibrationCertificatePayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(payload.plan_id);
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: `${ERROR_MESSAGES.PLAN_NOT_FOUND}: plan #${payload.plan_id}` };
    }
    if (plan.status !== "ASSIGNED") {
      throw { status: 409, code: ERROR_CODES.PLAN_NOT_ASSIGNED, message: `${ERROR_MESSAGES.PLAN_NOT_ASSIGNED}: plan #${plan.id} is ${plan.status}` };
    }
    const device = measuringDeviceRepository.findById(plan.device_id);
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: `${ERROR_MESSAGES.DEVICE_NOT_FOUND}: device #${plan.device_id}` };
    }
    const certificate = calibrationCertificateRepository.save(createCalibrationCertificateDto({
      device_id: device.id,
      plan_id: plan.id,
      certificate_no: payload.certificate_no,
      result_status: payload.result_status as CertificateResult,
      valid_until: toDateKey(payload.valid_until) as string,
      file_path: payload.file_path ?? "",
      issued_by: payload.issued_by ?? actor
    }));
    console.info(LOG_TEMPLATES.CalibrationCertificate.create, toAuditTarget("CalibrationCertificate", certificate.id), `actor=${actor}`);
    calibrationPlanRepository.update(plan.id, { status: "CERT_UPLOADED" });
    let closedAlerts: OverdueAlert[] = [];
    if (isCertificatePass(certificate.result_status)) {
      measuringDeviceRepository.update(device.id, { status: DEVICE_STATUS_VALID, next_due_date: certificate.valid_until });
      closedAlerts = overdueAlertService.closePendingForPlan(plan.id, actor);
      console.info(LOG_TEMPLATES.CalibrationCertificate.pass, toAuditTarget("CalibrationCertificate", certificate.id), `device=${device.id}`, `next_due_date=${certificate.valid_until}`);
    }
    return {
      certificate,
      plan: calibrationPlanRepository.findById(plan.id),
      device: measuringDeviceRepository.findById(device.id),
      closed_alerts: closedAlerts
    };
  }
};
