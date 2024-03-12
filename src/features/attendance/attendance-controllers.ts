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
      const { shift_id, long, lat } = req.body;
      const attendance_file: Express.Multer.File | undefined = req.file;
      const result = await AttendanceService.attendanceCheck({
        employee_id,
        shift_id,
        type: "CHECK_IN",
        long,
        lat,
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
      const { shift_id, long, lat } = req.body;
      const attendance_file: Express.Multer.File | undefined = req.file;
      const result = await AttendanceService.attendanceCheck({
        employee_id,
        shift_id,
        type: "CHECK_OUT",
        long,
        lat,
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
}
