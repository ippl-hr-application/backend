import { NextFunction, Request, Response } from "express";
import { MeraihService } from "./meraih-service";

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
}
