import { Request, Response, NextFunction } from "express";
import { ProfileService } from "./profile-service";

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { unique_id } = res.locals.user;
      const employeeProfile = await ProfileService.getProfile({
        unique_id,
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
