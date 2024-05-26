import { ErrorResponse } from "../models";
import jwt from "jsonwebtoken";
import e, { Request, Response, NextFunction } from "express";
import { EmployeeToken, UserToken } from "../models/token_model";
import { prisma } from "../applications";

export class JWTMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ErrorResponse("Unauthorized", 401, ["token"], "UNAUTHORIZED");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      res.locals.user = decoded as UserToken | EmployeeToken;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async employeeOnly(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as EmployeeToken;
      if (!user.employee_id) {
        throw new ErrorResponse(
          "This route can only be accessed by employees, please login as an employee to continue",
          403,
          ["FORBIDDEN"],
          "FORBIDDEN"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static async ownerOnly(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as UserToken;
      if (!user.user_id) {
        throw new ErrorResponse(
          "This route can only be accessed by owners, please login as an owner to continue",
          403,
          ["FORBIDDEN"],
          "FORBIDDEN"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static async ownerAndManagerOnly(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { employee_id } = res.locals.user as EmployeeToken;

      if (employee_id) {
        const userData = await prisma.employee.findFirst({
          where: {
            employee_id,
          },
          select: {
            job_position: {
              select: {
                name: true,
              },
            },
          },
        });

        if (
          userData &&
          userData.job_position.name !== "Owner" &&
          userData.job_position.name !== "Manager"
        ) {
          throw new ErrorResponse(
            "This route can only be accessed by manager and owner.",
            403,
            ["FORBIDDEN"],
            "FORBIDDEN"
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
