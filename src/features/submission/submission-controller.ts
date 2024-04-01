import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { SubmissionService } from "./submission-service";
export class SubmissionController {
  static async createPermissionLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        from,
        to,
        permission_reason,
        file_name,
        file_size,
        file_type,
        file_url,
      } = req.body;
      const { employee_id } = res.locals.user;
      const result = await SubmissionService.createSickLetter({
        from,
        to,
        permission_reason,
        type: "IZIN",
        employee_id,
        file_name,
        file_size: Number(file_size),
        file_type,
        file_url,
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
      const {
        from,
        to,
        permission_reason,
        file_name,
        file_size,
        file_type,
        file_url,
      } = req.body;
      const { employee_id } = res.locals.user;

      const result = await SubmissionService.createSickLetter({
        from,
        to,
        permission_reason,
        type: "SAKIT",
        employee_id,
        file_name,
        file_size: Number(file_size),
        file_type,
        file_url,
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
      const {
        from,
        to,
        leave_reason,
        leave_type,
        file_name,
        file_size,
        file_type,
        file_url,
      } = req.body;
      const { employee_id } = res.locals.user;
      const result = await SubmissionService.createLeaveLetter({
        from,
        to,
        leave_reason,
        leave_type,
        employee_id,
        file_name,
        file_size: Number(file_size),
        file_type,
        file_url,
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
      const { mutation_reason, file_name, file_size, file_type, file_url } =
        req.body;
      const { employee_id } = res.locals.user;

      const result = await SubmissionService.createMutationLetter({
        mutation_reason,
        employee_id,
        file_name,
        file_size: Number(file_size),
        file_type,
        file_url,
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
  static async getSubmissionHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { employee_id } = res.locals.user;
      const result = await SubmissionService.getSubmissionHistory({
        employee_id,
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { submission_id } = req.params;
      const result = await SubmissionService.deleteSubmission({
        submission_id: Number(submission_id),
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
