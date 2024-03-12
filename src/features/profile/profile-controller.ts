import { Request, Response, NextFunction } from "express";
import { ProfileService } from "./profile-service";

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = res.locals.user;
      const employeeProfile = await ProfileService.getProfile({
        employee_id,
      });

      return res.status(200).json({
        success: true,
        data: { ...employeeProfile },
        message: "Profile Retrieved",
      });
    } catch (error) {
      next(error);
    }
  }
}
