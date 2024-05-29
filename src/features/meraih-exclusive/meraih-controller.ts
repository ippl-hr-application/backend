import { NextFunction, Request, Response } from "express";
import { MeraihService } from "./meraih-service";
import { PackageType } from "@prisma/client";

export class MeraihController {
  static async getAllRegisteredUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await MeraihService.getAllRegisteredUsers();

      return res.status(200).json({
        success: true,
        data: { users },
        message: "Registered users fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCompanyPackageType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id } = req.params;
      const { package_type, package_end } = req.body;

      await MeraihService.updateCompanyPackageType({
        company_id,
        package_type,
        package_end,
      });

      return res.status(200).json({
        success: true,
        message: "User package type updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await MeraihService.login({ email, password });

      return res.status(200).json({
        success: true,
        data: { token },
        message: "User logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
