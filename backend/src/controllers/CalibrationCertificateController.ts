import type { NextFunction, Request, Response } from "express";
import { calibrationCertificateService } from "../services/CalibrationCertificateService";

const actorOf = (req: Request) => String((req as any).user?.id ?? "system");

export const calibrationCertificateController = {
  list: (_req: Request, res: Response) => res.json(calibrationCertificateService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(calibrationCertificateService.create(req.body, actorOf(req)));
    } catch (err) {
      next(err);
    }
  }
};
