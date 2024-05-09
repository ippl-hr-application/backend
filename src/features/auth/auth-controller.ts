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
      const { employee_id, password } = req.body;
      const token = await AuthService.employeeLogin({
        employee_id,
        password,
      });
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
      const user = await AuthService.getCurrentLoggedInUser(
        user_id,
        employee_id
      );
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
      const { token, new_password } = req.body;
      await AuthService.resetPassword(token, new_password);
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async ownerForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      await AuthService.ownerForgotPassword(email);
      return res.status(200).json({
        success: true,
        message: "Please check your email for password reset link",
      });
    } catch (error) {
      next(error);
    }
  }

  static async employeeForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { employee_id } = req.body;
      await AuthService.employeeForgotPassword(employee_id);
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
      const { token, new_password } = req.body;
      await AuthService.employeeResetPassword(token, new_password);
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
