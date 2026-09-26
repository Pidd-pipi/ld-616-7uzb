import { overdueAlertRepository } from "../repositories/OverdueAlertRepository";
import { ALERT_TEXT } from "../constants/alertText";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createOverdueAlertDto } from "../constructors/OverdueAlertDtoFactory";
import type { CalibrationPlan } from "../models/CalibrationPlan";
import type { CalibrationVendor } from "../models/CalibrationVendor";
import type { OverdueAlert } from "../models/OverdueAlert";
import type { OverdueAlertPayload } from "../types/OverdueAlertPayload";

export const overdueAlertService = {
  list: () => overdueAlertRepository.findAll(),

  create: (payload: OverdueAlertPayload) => {
    const { id: _id, ...row } = createOverdueAlertDto({
      device_id: Number(payload.device_id),
      plan_id: Number(payload.plan_id),
      alert_level: payload.alert_level ?? "MEDIUM",
      alert_reason: payload.alert_reason ?? ""
    });
    return overdueAlertRepository.save(row);
  },

  createPendingForPlan: (plan: CalibrationPlan, vendor: CalibrationVendor) => {
    const { id: _id, ...row } = createOverdueAlertDto({
      device_id: plan.device_id,
      plan_id: plan.id,
      alert_level: plan.priority === "HIGH" ? "HIGH" : "MEDIUM",
      alert_reason: ALERT_TEXT.PLAN_ASSIGNED(plan.id, vendor.id),
      handled_by: null,
      handled_at: null,
      status: "PENDING"
    });
    const created = overdueAlertRepository.save(row);
    console.info(LOG_TEMPLATES.OverdueAlert.autoCreate, created.id, "plan", plan.id);
    return created;
  },

  closePendingForPlan: (planId: number, actor: string) => {
    const handledAt = new Date().toISOString();
    const closed: OverdueAlert[] = [];
    for (const alert of overdueAlertRepository.findByPlanId(planId)) {
      if (alert.status !== "PENDING") continue;
      const updated = overdueAlertRepository.update(alert.id, {
        status: "CLOSED",
        handled_by: actor,
        handled_at: handledAt
      });
      if (updated) closed.push(updated);
    }
    if (closed.length > 0) {
      console.info(LOG_TEMPLATES.OverdueAlert.close, "plan", planId, "actor", actor);
    }
    return closed;
  }
};
