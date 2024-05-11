import { NextFunction, Request, Response } from "express";
import { AttendanceManagementService } from "./attendance-management-service";

export class AttendanceManagementController {
  static async getAllAttendances(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = res.locals.user;
      const attendances = await AttendanceManagementService.getAllAttendances(
        company_branch_id
      );
      return res.status(201).json({
        success: true,
        data: attendances,
        message: "Attendances Found",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAttendanceById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { attendance_id } = req.params;
      const attendance = await AttendanceManagementService.getAttendanceById(
        Number(attendance_id)
      );
      return res.status(201).json({
        success: true,
        data: attendance,
        message: "Attendance Found",
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { attendance_check_id } = req.params;
      const { status } = req.body;
      const attendance = await AttendanceManagementService.updateAttendance({
        attendance_check_id: Number(attendance_check_id),
        status,
      });
      return res.status(201).json({
        success: true,
        data: attendance,
        message: "Attendance Updated",
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { attendance_id } = req.params;
      const assignShift = await AttendanceManagementService.deleteAttendance(
        Number(attendance_id)
      );
      return res.status(201).json({
        success: true,
        data: { ...assignShift },
        message: "Assign Shift Added",
      });
    } catch (error) {
      next(error);
    }
  }
}
