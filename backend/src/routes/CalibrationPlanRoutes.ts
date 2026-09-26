import { Router } from "express";
import { calibrationPlanController } from "../controllers/CalibrationPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", calibrationPlanController.list);
router.post("/", rbacMiddleware(["admin", "calibrator"]), calibrationPlanController.create);
router.post("/:id/reschedule", rbacMiddleware(["admin", "calibrator"]), calibrationPlanController.reschedule);
router.post("/:id/assign", rbacMiddleware(["admin", "calibrator"]), calibrationPlanController.assign);
export default router;
