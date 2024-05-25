import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./attendance-service";
import { z } from "zod";
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
      const result = await AttendanceService.attendanceCheckIn({
        employee_id,
        assign_shift_id: Number(assign_shift_id),

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
      const { attendance_id, long, lat } = req.body;
      const attendance_file = req.file;
      const result = await AttendanceService.attendanceCheckOut({
        employee_id,
        attendance_id: Number(attendance_id),
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
      const { month, year } = req.query;
      const result = await AttendanceService.getRecap({
        employee_id,
        month: month as string,
        year: year as string,
      });
      return res.status(200).json({
        success: true,
        data: {
          ...result,
        },
        message: "Recap Retrieved",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getHistoryAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { employee_id } = res.locals.user;
      const { date } = req.query;
      const result = await AttendanceService.getHistoryAttendance({
        employee_id,
        date: new Date(date as string),
      });
      return res.status(200).json({
        success: true,
        data: {
          ...result,
        },
        message: "History Retrieved",
      });
    } catch (error) {
      next(error);
    }
  }
}
