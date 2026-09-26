import type { NextFunction, Request, Response } from "express";
import { calibrationPlanService } from "../services/CalibrationPlanService";
import { validatePlanAssignPayload, validatePlanCreatePayload, validatePlanReschedulePayload } from "../validators/CalibrationPlanValidator";

const actorOf = (req: Request): string => String((req as Request & { user?: { id?: unknown } }).user?.id ?? "system");

export const calibrationPlanController = {
  list: (_req: Request, res: Response) => res.json(calibrationPlanService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(calibrationPlanService.create(validatePlanCreatePayload(req.body), actorOf(req)));
    } catch (err) {
      next(err);
    }
  },
  reschedule: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(calibrationPlanService.reschedule(Number(req.params.id), validatePlanReschedulePayload(req.body), actorOf(req)));
    } catch (err) {
      next(err);
    }
  },
  assign: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(calibrationPlanService.assign(Number(req.params.id), validatePlanAssignPayload(req.body), actorOf(req)));
    } catch (err) {
      next(err);
    }
  }
};
