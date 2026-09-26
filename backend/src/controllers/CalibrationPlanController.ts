import type { NextFunction, Request, Response } from "express";
import { calibrationPlanService } from "../services/CalibrationPlanService";

const actorOf = (req: Request) => String((req as any).user?.id ?? "system");

export const calibrationPlanController = {
  list: (_req: Request, res: Response) => res.json(calibrationPlanService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(calibrationPlanService.create(req.body, actorOf(req)));
    } catch (err) {
      next(err);
    }
  },
  reschedule: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(calibrationPlanService.reschedule(Number(req.params.id), req.body, actorOf(req)));
    } catch (err) {
      next(err);
    }
  },
  assign: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(calibrationPlanService.assign(Number(req.params.id), req.body, actorOf(req)));
    } catch (err) {
      next(err);
    }
  }
};
