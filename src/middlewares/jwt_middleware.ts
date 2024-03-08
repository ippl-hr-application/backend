import { ErrorResponse } from "../models";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { EmployeeToken, UserToken } from "../models/token_model";

export class JWTMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ErrorResponse("Unauthorized", 401, ["token"], "UNAUTHORIZED");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      res.locals.user = (decoded as UserToken | EmployeeToken);
      next();
    } catch (error) {
      next(error);
    }
  }
}
