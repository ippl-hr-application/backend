import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth-service";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login({ email, password });
      return res.status(200).json({
        success: true,
        data: { ...token },
        message: "User logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = await AuthService.register(data);
      return res.status(201).json({
        success: true,
        data: { user },
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentLoggedInUser(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user_id } = res.locals.user;
      const user = await AuthService.getCurrentLoggedInUser(user_id);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
