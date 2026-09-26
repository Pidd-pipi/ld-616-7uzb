import type { NextFunction, Request, Response } from "express";
import { calibrationCertificateService } from "../services/CalibrationCertificateService";
import { validateCertificateCreatePayload } from "../validators/CalibrationCertificateValidator";

const actorOf = (req: Request): string => String((req as Request & { user?: { id?: unknown } }).user?.id ?? "system");

export const calibrationCertificateController = {
  list: (_req: Request, res: Response) => res.json(calibrationCertificateService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(calibrationCertificateService.create(validateCertificateCreatePayload(req.body), actorOf(req)));
    } catch (err) {
      next(err);
    }
  }
};
