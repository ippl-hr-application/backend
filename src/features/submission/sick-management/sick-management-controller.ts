import { NextFunction, Request, Response } from "express";
import { SickManagementService } from "./sick-management-service";

export class SickManagementController {
  static async getAllByCompanyBranchId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;

      const result = await SickManagementService.getAllByCompanyBranchId(
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
      const result = await SickManagementService.getById(Number(submission_id));
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
      const result = await SickManagementService.validateLetter({
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
      const result = await SickManagementService.deleteLetter(
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
