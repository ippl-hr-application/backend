import { NextFunction, Request, Response } from "express";
import { SubmissionService } from "./submission-service";
export class SubmissionController {
  static async createPermissionLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { date_time, permission_reason } = req.body;
      const { employee_id } = res.locals.user;
      const permission_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createSickLetter({
        date_time,
        permission_reason,
        type: "IZIN",
        employee_id,
        permission_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          result,
        },
        message: "Permission Letter Submitted",
      });
    } catch (error) {
      next(error);
    }
  }
  static async createSickLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { date_time, permission_reason } = req.body;
      const { employee_id } = res.locals.user;
      const permission_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createSickLetter({
        date_time,
        permission_reason,
        type: "SAKIT",
        employee_id,
        permission_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          result,
        },
        message: "Sick Letter Submitted",
      });
    } catch (error) {
      next(error);
    }
  }
}
