import { NextFunction, Request, Response } from "express";
import { EmployeeToken, ErrorResponse, UserToken } from "../models";
import { prisma } from "../applications";
import { PackageType } from "@prisma/client";

export class PackageTypeMiddleware {
  static async isPackagePremium(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { company_id, company_branch_id } = res.locals.user as
      | UserToken
      | EmployeeToken;

    if (company_id) {
      const company = await prisma.company.findFirst({
        where: { company_id },
        select: {
          package_type: true,
        },
      });

      if (company?.package_type === PackageType.PREMIUM) {
        next();
      } else {
        next(
          new ErrorResponse(
            "You don't have the right package to send this request, please upgrade your package type.",
            403,
            ["package_type"],
            "FORBIDDEN"
          )
        );
      }
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

      if (companyBranch?.company?.package_type === PackageType.PREMIUM) {
        next();
      } else {
        next(
          new ErrorResponse(
            "You don't have the right package to send this request, please upgrade your package type.",
            403,
            ["package_type"],
            "FORBIDDEN"
          )
        );
      }
    } else {
      next(
        new ErrorResponse(
          "You don't have the right package to send this request, please upgrade your package type.",
          403,
          ["package_type"],
          "FORBIDDEN"
        )
      );
    }
  }

  static async dailyCheckExpiredPremiumPackage() {
    const today = new Date();
    const companies = await prisma.company.findMany({
      where: {
        package_type: PackageType.PREMIUM,
        package_end: {
          lte: today,
        },
      },
    });

    for (const company of companies) {
      await prisma.company.update({
        where: { company_id: company.company_id },
        data: {
          package_type: PackageType.FREE,
        },
      });
    }
  }
}
