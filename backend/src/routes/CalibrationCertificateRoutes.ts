import { Router } from "express";
import { calibrationCertificateController } from "../controllers/CalibrationCertificateController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", calibrationCertificateController.list);
router.post("/", rbacMiddleware(["admin", "calibrator"]), calibrationCertificateController.create);
export default router;
