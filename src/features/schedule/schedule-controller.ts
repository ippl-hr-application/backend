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
  static async deleteSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { schedule_id } = req.params;
      const schedule = await ScheduleService.deleteSchedule({
        schedule_id: Number(schedule_id),
      });
      return res.status(201).json({
        success: true,
        data: { ...schedule },
        message: "Schedule Deleted",
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { schedule_id } = req.params;
      const { title, description, date } = req.body;
      const schedule = await ScheduleService.updateSchedule({
        schedule_id: Number(schedule_id),
        title,
        description,
        date,
      });
      return res.status(201).json({
        success: true,
        data: { ...schedule },
        message: "Schedule Updated",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getDetailSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { schedule_id } = req.params;
      const schedule = await ScheduleService.getDetailSchedule({
        schedule_id: Number(schedule_id),
      });
      return res.status(201).json({
        success: true,
        data: { ...schedule },
        message: "Schedule Found",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { month, year } = req.query;

      const schedules = await ScheduleService.getAllSchedules({
        month: Number(month),
        year: Number(year),
      });
      return res.status(201).json({
        success: true,
        data: { ...schedules },
        message: "Schedules Found",
      });
    } catch (error) {
      next(error);
    }
  }
}
