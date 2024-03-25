import { NextFunction, Request, Response } from "express";
import { EmployeeToken, ErrorResponse, UserToken } from "../models";
import { prisma } from "../applications";

export class PackageTypeMiddleware {
  static async isPackagePremium(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { package_type, company_branch_id } = res.locals.user as
      | UserToken
      | EmployeeToken;
      
    if (package_type && package_type === "premium") {
      next();
    } else if (company_branch_id) {
      const companyBranch = await prisma.companyBranches.findFirst({
        where: { company_branch_id },
        select: {
          company: {
            select: {
              package_type: true,
            },
          },
        },
      });

      if (companyBranch?.company?.package_type === "premium") {
        next();
      } else {
        next(new ErrorResponse("You don't have the right package to send this request, please upgrade your package type.", 403, ["package_type"], "FORBIDDEN"));
      }
    } else {
      next(new ErrorResponse("You don't have the right package to send this request, please upgrade your package type.", 403, ["package_type"], "FORBIDDEN"));
    }

  }
}
