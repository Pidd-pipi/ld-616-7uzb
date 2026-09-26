import { overdueAlertRepository } from "../repositories/OverdueAlertRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ALERT_STATUS_CLOSED } from "../constants/OverdueAlertStatus";
import { nowIso, toAuditTarget } from "../utils/formatters";
import type { OverdueAlert } from "../models/OverdueAlert";

export const overdueAlertService = {
  list: () => overdueAlertRepository.findAll(),
  create: (row: OverdueAlert) => overdueAlertRepository.save(row),
  closePendingForPlan: (planId: number, actor: string): OverdueAlert[] => {
    const handledAt = nowIso();
    return overdueAlertRepository.findPendingByPlanId(planId).map((alert) => {
      const closed = overdueAlertRepository.update(alert.id, { status: ALERT_STATUS_CLOSED, handled_by: actor, handled_at: handledAt });
      console.info(LOG_TEMPLATES.OverdueAlert.close, toAuditTarget("OverdueAlert", alert.id), `handled_by=${actor}`);
      return closed as OverdueAlert;
    });
  }
};
