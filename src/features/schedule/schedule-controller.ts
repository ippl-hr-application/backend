import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "./schedule-service";

export class ScheduleController {
  static async addSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, date } = req.body;
      const { unique_id } = res.locals.user;
      const schedule = await ScheduleService.addSchedule({
        title,
        description,
        date,
        unique_id,
      });
      return res.status(201).json({
        success: true,
        data: { ...schedule },
        message: "Schedule Added",
      });
    } catch (error) {
      next(error);
    }
  }
}
