import { NextFunction, Request, Response } from "express";
import { SubmissionService } from "./submission-service";
export class SubmissionController {
  static async createPermissionLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { date_and_time, permission_reason } = req.body;
      const { employee_id } = res.locals.user;
      const permission_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createSickLetter({
        date_and_time,
        permission_reason,
        type: "IZIN",
        employee_id,
        permission_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
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
      const { date_and_time, permission_reason } = req.body;
      const { employee_id } = res.locals.user;
      const permission_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createSickLetter({
        date_and_time,
        permission_reason,
        type: "SAKIT",
        employee_id,
        permission_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
        },
        message: "Sick Letter Submitted",
      });
    } catch (error) {
      next(error);
    }
  }
  static async createLeaveLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { from, to, leave_reason, leave_type } = req.body;
      const { employee_id } = res.locals.user;
      const leave_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createLeaveLetter({
        from,
        to,
        leave_reason,
        leave_type,
        employee_id,
        leave_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
        },
        message: "Leave Letter Submitted",
      });
    } catch (error) {
      next(error);
    }
  }
  static async createMutationLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { mutation_reason } = req.body;
      const { employee_id } = res.locals.user;
      const mutation_file: Express.Multer.File | undefined = req.file;
      const result = await SubmissionService.createMutationLetter({
        mutation_reason,
        employee_id,
        mutation_file,
      });
      return res.status(201).json({
        success: true,
        data: {
          ...result,
        },
        message: "Mutation Letter Submitted",
      });
    } catch (error) {
      next(error);
    }
  }
}
