import { NextFunction, Request, Response } from "express";
import { CompanyBranchService } from "./company-branch-service";
import { UserToken } from "../../models";

export class CompanyBranchController {
  static async addNewBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id } = res.locals.user as UserToken;
      const data = req.body;

      const branch = await CompanyBranchService.addNewBranch(company_id, data);

      return res.status(201).json({
        success: true,
        data: { company_branch: branch },
        message: "Employee logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async editBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = req.params;
      const data = req.body;

      const branch = await CompanyBranchService.editBranch(
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
}
