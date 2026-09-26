import type { MeasuringDevice } from "../models/MeasuringDevice";
export const createMeasuringDeviceDto = (overrides: Partial<MeasuringDevice> = {}): MeasuringDevice => ({ id: 0, device_code: "", name: "", device_type: "PRESSURE_GAUGE", accuracy_level: "", owner_dept: "", calibration_cycle_days: 365, status: "VALID", next_due_date: null, ...overrides });
