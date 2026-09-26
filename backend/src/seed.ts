import type { MeasuringDevice } from "./models/MeasuringDevice";
import type { CalibrationPlan } from "./models/CalibrationPlan";
import type { CalibrationCertificate } from "./models/CalibrationCertificate";
import type { CalibrationVendor } from "./models/CalibrationVendor";
import type { OverdueAlert } from "./models/OverdueAlert";

export const seed: {
  measuringDevice: MeasuringDevice[];
  calibrationPlan: CalibrationPlan[];
  calibrationCertificate: CalibrationCertificate[];
  calibrationVendor: CalibrationVendor[];
  overdueAlert: OverdueAlert[];
} = {
  measuringDevice: [
    { id: 1, device_code: "DEV-0001", name: "压力表 A", device_type: "PRESSURE_GAUGE", accuracy_level: "0.5", owner_dept: "计量一室", calibration_cycle_days: 365, status: "VALID", next_due_date: "2027-03-01" },
    { id: 2, device_code: "DEV-0002", name: "标准温度计", device_type: "THERMOMETER", accuracy_level: "0.1", owner_dept: "计量二室", calibration_cycle_days: 180, status: "DUE_SOON", next_due_date: "2026-10-10" },
    { id: 3, device_code: "DEV-0003", name: "电子天平", device_type: "BALANCE", accuracy_level: "0.01", owner_dept: "理化实验室", calibration_cycle_days: 90, status: "OVERDUE", next_due_date: "2026-09-01" }
  ],
  calibrationPlan: [
    { id: 1, device_id: 1, planned_date: "2026-10-01", plan_type: "PERIODIC", priority: "NORMAL", status: "PLANNED", assigned_vendor_id: null, created_by: "1" },
    { id: 2, device_id: 2, planned_date: "2026-10-10", plan_type: "PERIODIC", priority: "HIGH", status: "ASSIGNED", assigned_vendor_id: 1, created_by: "1" },
    { id: 3, device_id: 3, planned_date: "2026-09-01", plan_type: "PERIODIC", priority: "NORMAL", status: "CLOSED", assigned_vendor_id: 3, created_by: "1" }
  ],
  calibrationCertificate: [
    { id: 1, device_id: 3, plan_id: 3, certificate_no: "CERT-2026-0001", result_status: "PASS", valid_until: "2026-12-01", file_path: "/files/cert-2026-0001.pdf", issued_by: "精密衡器校准中心" }
  ],
  calibrationVendor: [
    { id: 1, vendor_name: "华东计量院", qualification_no: "Q-2026-001", contact_phone: "13800000001", service_scope: "PRESSURE_GAUGE,THERMOMETER", vendor_status: "ACTIVE" },
    { id: 2, vendor_name: "北方校准所", qualification_no: "Q-2024-002", contact_phone: "13800000002", service_scope: "THERMOMETER", vendor_status: "DISABLED" },
    { id: 3, vendor_name: "精密衡器校准中心", qualification_no: "Q-2025-003", contact_phone: "13800000003", service_scope: "BALANCE", vendor_status: "ACTIVE" }
  ],
  overdueAlert: [
    { id: 1, device_id: 2, plan_id: 2, alert_level: "MEDIUM", alert_reason: "plan #2 assigned to vendor #1, awaiting execution", handled_by: null, handled_at: null, status: "PENDING" },
    { id: 2, device_id: 3, plan_id: 3, alert_level: "HIGH", alert_reason: "plan #3 closed after certificate CERT-2026-0001", handled_by: "1", handled_at: "2026-09-02T09:00:00.000Z", status: "CLOSED" }
  ]
};
