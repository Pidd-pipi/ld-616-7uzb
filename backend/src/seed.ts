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
    {
      id: 1,
      device_code: "DEV-0001",
      name: "精密压力表",
      device_type: "pressure_gauge",
      accuracy_level: "0.4级",
      owner_dept: "计量一室",
      calibration_cycle_days: 365,
      status: "VALID",
      next_due_date: "2027-03-01"
    },
    {
      id: 2,
      device_code: "DEV-0002",
      name: "数字温度计",
      device_type: "thermometer",
      accuracy_level: "A级",
      owner_dept: "计量二室",
      calibration_cycle_days: 180,
      status: "DUE_SOON",
      next_due_date: "2026-10-01"
    },
    {
      id: 3,
      device_code: "DEV-0003",
      name: "扭矩扳手",
      device_type: "torque_wrench",
      accuracy_level: "3级",
      owner_dept: "装配车间",
      calibration_cycle_days: 365,
      status: "CALIBRATING",
      next_due_date: "2026-09-10"
    }
  ],
  calibrationPlan: [
    {
      id: 1,
      device_id: 1,
      planned_date: "2026-09-20T00:00:00Z",
      plan_type: "PERIODIC",
      priority: "NORMAL",
      status: "ASSIGNED",
      assigned_vendor_id: 1,
      created_by: "seed"
    },
    {
      id: 2,
      device_id: 2,
      planned_date: "2026-09-25T00:00:00Z",
      plan_type: "PERIODIC",
      priority: "HIGH",
      status: "PLANNED",
      assigned_vendor_id: null,
      created_by: "seed"
    },
    {
      id: 3,
      device_id: 3,
      planned_date: "2026-08-15T00:00:00Z",
      plan_type: "PERIODIC",
      priority: "NORMAL",
      status: "CLOSED",
      assigned_vendor_id: 2,
      created_by: "seed"
    }
  ],
  calibrationCertificate: [
    {
      id: 1,
      device_id: 3,
      plan_id: 3,
      certificate_no: "CERT-2026-0001",
      result_status: "PASS",
      valid_until: "2027-08-15",
      file_path: "/files/cert-2026-0001.pdf",
      issued_by: "方圆校准"
    }
  ],
  calibrationVendor: [
    {
      id: 1,
      vendor_name: "华测计量",
      qualification_no: "Q-1001",
      contact_phone: "13800000001",
      service_scope: "pressure_gauge,thermometer",
      vendor_status: "ACTIVE"
    },
    {
      id: 2,
      vendor_name: "方圆校准",
      qualification_no: "Q-1002",
      contact_phone: "13800000002",
      service_scope: "torque_wrench",
      vendor_status: "ACTIVE"
    },
    {
      id: 3,
      vendor_name: "旧友计量（已停用）",
      qualification_no: "Q-1003",
      contact_phone: "13800000003",
      service_scope: "pressure_gauge",
      vendor_status: "DISABLED"
    }
  ],
  overdueAlert: [
    {
      id: 1,
      device_id: 1,
      plan_id: 1,
      alert_level: "MEDIUM",
      alert_reason: "计划#1已派发机构#1，等待证书回收",
      handled_by: null,
      handled_at: null,
      status: "PENDING"
    },
    {
      id: 2,
      device_id: 3,
      plan_id: 3,
      alert_level: "MEDIUM",
      alert_reason: "计划#3已派发机构#2，等待证书回收",
      handled_by: "seed",
      handled_at: "2026-08-20T09:00:00Z",
      status: "CLOSED"
    }
  ]
};
