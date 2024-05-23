import { NextFunction, Request, Response } from "express";
import { CompanyBranchService } from "./company-branch-service";
import { EmployeeToken, UserToken } from "../../models";

export class CompanyBranchController {
  static async addNewBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id, user_id } = res.locals.user as UserToken;
      const data = req.body;

      const branch = await CompanyBranchService.addNewBranch(
        company_id,
        user_id,
        data
      );

      return res.status(201).json({
        success: true,
        data: { company_branch: branch },
        message: "Company Branch created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async editBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id } = res.locals.user as UserToken;
      const { company_branch_id } = req.params;
      const data = req.body;

      const branch = await CompanyBranchService.editBranch(
        company_id,
        company_branch_id,
        data
      );

      return res.status(200).json({
        success: true,
        data: { company_branch: branch },
        message: "Employee logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id } = res.locals.user as UserToken;
      const branches = await CompanyBranchService.getAllBranches(company_id);
      return res.status(200).json({
        success: true,
        data: {
          branches,
        },
        message: "Company branches retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = req.params;
      const statistics = await CompanyBranchService.getStatistics(
        company_branch_id
      );

      return res.status(200).json({
        success: true,
        data: {
          ...statistics,
        },
        message: "Company statistics retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id } = res.locals.user as UserToken;
      const { company_branch_id } = req.params;
      await CompanyBranchService.deleteBranch(company_id, company_branch_id);

      return res.status(200).json({
        success: true,
        message: "Branch deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBranchById(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = req.params;
      const branch = await CompanyBranchService.getBranchById(
        company_branch_id
      );

      return res.status(200).json({
        success: true,
        data: {
          branch,
        },
        message: "Branch data retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
