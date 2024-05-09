import { NextFunction, Request, Response } from "express";
import { EmployeeToken, ErrorResponse, UserToken } from "../models";
import { prisma } from "../applications";

export class CompanyMiddleware {
  static async isCompanyBranchBelongsToCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id } = res.locals.user as EmployeeToken | UserToken;
      const { company_branch_id } = req.params;

      const companyBranch = await prisma.companyBranches.findFirst({
        where: {
          company_id,
          company_branch_id,
        },
      });

      if (!companyBranch) {
        throw new ErrorResponse("Company Branch not found", 404, [
          "company_branch_id",
        ]);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
