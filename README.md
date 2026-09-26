# 设备计量校准排期 API 服务

面向实验室和工厂的计量设备校准周期管理 API，覆盖设备台账、校准计划、证书、超期预警和外部机构管理。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

后端健康检查：<http://localhost:21116/health>

后端健康检查：<http://localhost:21116/health>


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

## 业务约束（计划派发与证书收口）

- `POST /api/calibration-plan` 创建计划、`POST /api/calibration-plan/{id}/reschedule` 改期：同一台设备已存在**未完结**（非 CLOSED / CANCELLED）且计划日期相同的计划时，返回 `409 PLAN_DATE_CONFLICT`，响应 `details.conflictPlan` 指明冲突的是哪条计划。
- `POST /api/calibration-plan/{id}/assign` 派发机构：机构 `vendor_status` 为 `DISABLED` 时返回 `409 VENDOR_DISABLED`；机构 `service_scope` 不覆盖设备 `device_type` 时返回 `409 VENDOR_SCOPE_MISMATCH`。派发成功后计划置为 `ASSIGNED`，并自动登记一条 `PENDING` 状态的待处理预警。
- `POST /api/calibration-certificate` 证书登记：只接受状态为 `ASSIGNED` 的计划，否则返回 `409 PLAN_NOT_ASSIGNED`；登记后计划置为 `CERT_UPLOADED`。
- 证书结果为 `PASS` / `LIMITED_PASS` 时：设备状态更新为 `VALID`、`next_due_date` 更新为证书 `valid_until`，同时关闭该计划对应的待处理预警，记录 `handled_by`（操作人）和 `handled_at`（处理时间）。

## 枚举/常量出现位置清单

- DeviceCalibrationStatus: constants/DeviceCalibrationStatus、types/DeviceCalibrationStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanStatus: constants/PlanStatus、types/PlanStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- CertificateResult: constants/CertificateResult（含 PASSING_RESULTS / isPassingResult）、types/CertificateResult、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AlertStatus: constants/AlertStatus、models/OverdueAlert、constructors/OverdueAlertDtoFactory、services/OverdueAlertService 均有引用。
- VendorStatus: constants/VendorStatus、models/CalibrationVendor、constructors/CalibrationVendorDtoFactory、services/CalibrationPlanService 均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
