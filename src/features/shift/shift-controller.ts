import { NextFunction, Request, Response } from "express";
import { ShiftService } from "./shift-service";

export class ShiftController {
  static async addShift(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, start_time, end_time } = req.body;
      const { company_branch_id } = res.locals.user;
      const shift = await ShiftService.addShift({
        company_branch_id,
        name,
        start_time,
        end_time,
      });
      return res.status(201).json({
        success: true,
        data: { ...shift },
        message: "Shift Added",
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteShift(req: Request, res: Response, next: NextFunction) {
    try {
      const { shift_id } = req.params;
      const shift = await ShiftService.deleteShift({
        shift_id: Number(shift_id),
      });
      return res.status(201).json({
        success: true,
        data: { shift },
        message: "Shifted Deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllshifts(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = res.locals.user;
      const shifts = await ShiftService.getAllShifts(company_branch_id);
      return res.status(201).json({
        success: true,
        data: { shifts },
        message: "shifts Found",
      });
    } catch (error) {
      next(error);
    }
  }
  static async addAssignShift(req: Request, res: Response, next: NextFunction) {
    try {
      const { shift_id, employee_id } = req.body;
      const assignShift = await ShiftService.addAssignShift({
        employee_id,
        shift_id: Number(shift_id),
      });
      return res.status(201).json({
        success: true,
        data: { assignShift },
        message: "Assign Shift Added",
      });
    } catch (error) {
      next(error);
    }
  }
}
