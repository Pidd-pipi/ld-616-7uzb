import { calibrationCertificateRepository } from "../repositories/CalibrationCertificateRepository";
import { calibrationPlanRepository } from "../repositories/CalibrationPlanRepository";
import { measuringDeviceRepository } from "../repositories/MeasuringDeviceRepository";
import { overdueAlertService } from "./OverdueAlertService";
import { CertificateResult, isPassingResult } from "../constants/CertificateResult";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createCalibrationCertificateDto } from "../constructors/CalibrationCertificateDtoFactory";
import type { CalibrationCertificatePayload } from "../types/CalibrationCertificatePayload";
import type { CalibrationCertificate } from "../models/CalibrationCertificate";

export const calibrationCertificateService = {
  list: () => calibrationCertificateRepository.findAll(),

  create: (payload: CalibrationCertificatePayload, actor: string) => {
    const plan = calibrationPlanRepository.findById(Number(payload.plan_id));
    if (!plan) {
      throw { status: 404, code: ERROR_CODES.PLAN_NOT_FOUND, message: ERROR_MESSAGES.PLAN_NOT_FOUND };
    }
    if (plan.status !== "ASSIGNED") {
      throw {
        status: 409,
        code: ERROR_CODES.PLAN_NOT_ASSIGNED,
        message: ERROR_MESSAGES.PLAN_NOT_ASSIGNED,
        details: { planId: plan.id, planStatus: plan.status }
      };
    }
    if (!payload.certificate_no || !payload.valid_until || !(CertificateResult as readonly string[]).includes(payload.result_status)) {
      throw { status: 400, code: ERROR_CODES.VALIDATION_FAILED, message: ERROR_MESSAGES.VALIDATION_FAILED };
    }
    const device = measuringDeviceRepository.findById(plan.device_id);
    if (!device) {
      throw { status: 404, code: ERROR_CODES.DEVICE_NOT_FOUND, message: ERROR_MESSAGES.DEVICE_NOT_FOUND };
    }
    const { id: _id, ...row } = createCalibrationCertificateDto({
      device_id: device.id,
      plan_id: plan.id,
      certificate_no: payload.certificate_no,
      result_status: payload.result_status as CalibrationCertificate["result_status"],
      valid_until: payload.valid_until,
      file_path: payload.file_path ?? "",
      issued_by: payload.issued_by ?? actor
    });
    const certificate = calibrationCertificateRepository.save(row);
    calibrationPlanRepository.update(plan.id, { status: "CERT_UPLOADED" });
    console.info(LOG_TEMPLATES.CalibrationCertificate.create, certificate.id, "plan", plan.id, "actor", actor);

    let closedAlerts: ReturnType<typeof overdueAlertService.closePendingForPlan> = [];
    if (isPassingResult(certificate.result_status)) {
      measuringDeviceRepository.update(device.id, {
        status: "VALID",
        next_due_date: certificate.valid_until
      });
      closedAlerts = overdueAlertService.closePendingForPlan(plan.id, actor);
      console.info(LOG_TEMPLATES.CalibrationCertificate.pass, certificate.id, "device", device.id, "actor", actor);
    }
    return { certificate, closedAlerts };
  }
};
