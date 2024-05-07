import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./attendance-service";
export class AttendanceController {
  static async getShiftInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const shiftInfo = await AttendanceService.getShiftInfo({
        employee_id,
      });
      return res.status(200).json({
        success: true,
        data: {
          ...shiftInfo,
        },
        message: "Shift Info Retrieved",
      });
    } catch (error) {
      next(error);
    }
  }
  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const { assign_shift_id, long, lat } = req.body;
      const attendance_file = req.file;
      const result = await AttendanceService.attendanceCheck({
        employee_id,
        type: "CHECK_IN",
        assign_shift_id: Number(assign_shift_id),
        long: Number(long),
        lat: Number(lat),
        attendance_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const { assign_shift_id, long, lat } = req.body;
      const attendance_file = req.file;
      const result = await AttendanceService.attendanceCheck({
        employee_id,

        type: "CHECK_OUT",
        assign_shift_id: Number(assign_shift_id),
        long: Number(long),
        lat: Number(lat),
        attendance_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const result = await AttendanceService.getToday(employee_id);
      return res.status(200).json({
        success: true,
        data: {
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getRecap(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const { month_and_year } = req.query;
      const result = await AttendanceService.getRecap({
        employee_id,
        month_and_year: month_and_year as string,
      });
      return res.status(200).json({
        success: true,
        data: {
          ...result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
