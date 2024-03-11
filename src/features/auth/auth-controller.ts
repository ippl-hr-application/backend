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

  static async employeeLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id, employee_id, password } = req.body;
      const token = await AuthService.employeeLogin({ company_id, employee_id, password });
      return res.status(200).json({
        success: true,
        data: { ...token },
        message: "Employee logged in successfully",
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
      const { user_id, employee_id } = res.locals.user;
      const user = await AuthService.getCurrentLoggedInUser(user_id, employee_id);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;
      await AuthService.resetPassword(email, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async employeeResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { employee_id, newPassword } = req.body;
      await AuthService.employeeResetPassword(employee_id, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
