import { NextFunction, Request, Response } from "express";
import { CompanyService } from "./company-service";
import { UserToken } from "../../models";

export class CompanyController {
  static async editCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id } = res.locals.user as UserToken;
      const data = req.body;

      const updatedCompany = await CompanyService.editCompany(company_id, data);

      return res.status(200).json({
        success: true,
        data: { company: updatedCompany },
        message: "Company updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}