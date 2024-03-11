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
}
