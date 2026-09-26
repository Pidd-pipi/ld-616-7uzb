# 设备计量校准排期 API 服务

面向实验室和工厂的计量设备校准周期管理 API，覆盖设备台账、校准计划、证书、超期预警和外部机构管理。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

后端健康检查：<http://localhost:21116/health>

```bash
# 创建计划（同设备 + 未完结计划 + 同日期会被 409 拒绝，并返回冲突计划详情）
curl -X POST http://localhost:21116/api/calibration-plan \
  -H 'Content-Type: application/json' \
  -d '{"device_id":1,"planned_date":"2026-10-01"}'

# 改期（同样做冲突检查，CLOSED/CANCELLED 计划不可改期）
curl -X POST http://localhost:21116/api/calibration-plan/1/reschedule \
  -H 'Content-Type: application/json' \
  -d '{"planned_date":"2026-11-01"}'

# 派发机构（机构停用或资质范围不覆盖设备类型会被 409 拒绝；成功后自动生成待处理预警）
curl -X POST http://localhost:21116/api/calibration-plan/1/assign \
  -H 'Content-Type: application/json' \
  -d '{"vendor_id":1}'

# 登记证书（只接受 ASSIGNED 计划；PASS/LIMITED_PASS 时更新设备状态与下次到期日并关闭预警）
curl -X POST http://localhost:21116/api/calibration-certificate \
  -H 'Content-Type: application/json' \
  -d '{"plan_id":1,"certificate_no":"CERT-2026-1003","result_status":"PASS","valid_until":"2027-10-01"}'
```

## 计划派发与证书收口约束

- **计划创建/改期冲突**：同一台设备已存在未完结（非 CLOSED/CANCELLED）计划且日期相同，返回 `409 PLAN_DATE_CONFLICT`，响应 `details.conflict_plan` 指明冲突的计划。
- **机构指派**：仅 `PLANNED` 状态计划可派发；机构 `DISABLED` 返回 `409 VENDOR_DISABLED`；机构 `service_scope` 不覆盖设备 `device_type` 返回 `409 VENDOR_SCOPE_MISMATCH`。
- **派发成功**：计划置为 `ASSIGNED`，自动登记一条 `PENDING` 超期预警。
- **证书登记**：仅接受 `ASSIGNED` 状态计划，否则 `409 PLAN_NOT_ASSIGNED`；登记后计划置为 `CERT_UPLOADED`。
- **证书通过**（`PASS`/`LIMITED_PASS`）：设备状态置为 `VALID`、`next_due_date` 更新为证书 `valid_until`，对应待处理预警关闭并记录 `handled_by`/`handled_at`；其他结果只登记证书，不动设备与预警。


## 本地开发方式


- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | - |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text

backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `calibration-api`

- `BACKEND_PORT`: 后端端口，默认 `21116`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: calibration-api`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-calibration-api}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceCalibrationStatus: constants/DeviceCalibrationStatus、models/MeasuringDevice、constructors/MeasuringDeviceDtoFactory、services/CalibrationCertificateService、seed、logTemplates、errorMessages 均有引用。
- PlanStatus: constants/PlanStatus（含 isOpenPlanStatus）、models/CalibrationPlan、repositories/CalibrationPlanRepository、services/CalibrationPlanService、services/CalibrationCertificateService、constructors、seed、logTemplates、errorMessages 均有引用。
- CertificateResult: constants/CertificateResult（含 isCertificatePass）、models/CalibrationCertificate、validators/CalibrationCertificateValidator、services/CalibrationCertificateService、constructors、seed 均有引用。
- CalibrationVendorStatus: constants/CalibrationVendorStatus（含 isVendorActive）、models/CalibrationVendor、services/CalibrationVendorService、services/CalibrationPlanService、constructors、seed、errorMessages 均有引用。
- OverdueAlertStatus / OverdueAlertLevel: constants/OverdueAlertStatus、constants/OverdueAlertLevel、models/OverdueAlert、repositories/OverdueAlertRepository、services/OverdueAlertService、services/CalibrationPlanService、constructors、seed 均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
