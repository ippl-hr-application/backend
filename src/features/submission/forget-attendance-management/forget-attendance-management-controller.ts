import { NextFunction, Request, Response } from "express";
import { ForgetAttendanceManagementService } from "./forget-attendance-management-service";

export class ForgetAttendanceManagementController {
  static async getAllByCompanyBranchId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { start_date, end_date } = req.query;
      const result =
        await ForgetAttendanceManagementService.getAllByCompanyBranchId(
          company_branch_id as string,
          start_date as string,
          end_date as string
        );
      return res.status(200).json({
        success: true,
        data: result,
        message: `Get All By Company Branch Id Success`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_id } = req.params;
      const result = await ForgetAttendanceManagementService.getById(
        Number(submission_id)
      );
      return res.status(200).json({
        success: true,
        data: result,
        message: "Get  By Id Success",
      });
    } catch (error) {
      next(error);
    }
  }
  static async validateLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_id, company_branch_id } = req.params;
      const { status } = req.body;
      const result = await ForgetAttendanceManagementService.validateLetter({
        submission_id: Number(submission_id),
        status: status as "ACCEPTED" | "REJECTED" | "PENDING",
        company_branch_id,
      });
      return res.status(200).json({
        success: true,
        data: result,
        message: "Validate Success",
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_id, company_branch_id } = req.params;
      const result = await ForgetAttendanceManagementService.deleteLetter(
        Number(submission_id),
        company_branch_id
      );
      return res.status(200).json({
        success: true,
        data: result,
        message: "Delete Success",
      });
    } catch (error) {
      next(error);
    }
  }
}
