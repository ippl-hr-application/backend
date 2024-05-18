import { NextFunction, Request, Response } from "express";
import { LeaveManagementService } from "./leave-management-service";

export class LeaveManagementController {
  static async getAllByCompanyBranchId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;

      const result = await LeaveManagementService.getAllByCompanyBranchId(
        company_branch_id as string
      );
      return res.status(200).json({
        success: true,
        code: 200,
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
      const result = await LeaveManagementService.getById(
        Number(submission_id)
      );
      return res.status(200).json({
        success: true,
        code: 200,
        data: result,
        message: "Get  By Id Success",
      });
    } catch (error) {
      next(error);
    }
  }
  static async validateLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_id } = req.params;
      const { status } = req.body;
      const result = await LeaveManagementService.validateLetter({
        submission_id: Number(submission_id),
        status: status as "ACCEPTED" | "REJECTED" | "PENDING",
      });
      return res.status(200).json({
        success: true,
        code: 200,
        data: result,
        message: "Validate Success",
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { submission_id } = req.params;
      const result = await LeaveManagementService.deleteLetter(
        Number(submission_id)
      );
      return res.status(200).json({
        success: true,
        code: 200,
        data: result,
        message: "Delete Success",
      });
    } catch (error) {
      next(error);
    }
  }
}
