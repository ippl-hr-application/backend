import { NextFunction, Request, Response } from "express";
import { PermissionManagementService } from "./permission-management-service";

export class PermissionManagementController {
  static async getAllByCompanyBranchId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { date } = req.query;
      const result = await PermissionManagementService.getAllByCompanyBranchId(
        company_branch_id as string,
        new Date(date as string)
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
      const { submission_id, company_branch_id } = req.params;
      const result = await PermissionManagementService.getById(
        Number(submission_id),
        company_branch_id
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
      const result = await PermissionManagementService.validateLetter({
        submission_id: Number(submission_id),
        status: status as "ACCEPTED" | "REJECTED" | "PENDING",
        company_branch_id: company_branch_id as string,
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
      const result = await PermissionManagementService.deleteLetter(
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
