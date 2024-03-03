import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../models";
import multer from "multer";
import { ZodError } from "zod";

export class ErrorMiddleware {
  static async notFound(_req: Request, _res: Response, next: NextFunction) {
    const error = new ErrorResponse("Not Found", 404, ["route"]);
    next(error);
  }

  static async returnError(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        code: 400,
        status: "error",
        message: err.message,
      });
    } else if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        code: 400,
        status: "VALIDATION_ERROR",
        errors: err.issues.map((issue) => ({
          [issue.path.join(".")]: issue.message,
        })),
        tags: err.issues.map((issue) => issue.path.join(".")),
      });
    } else if (err instanceof ErrorResponse) {
      return res.status(err.statusCode).json({
        success: false,
        code: err.statusCode,
        status: err.errorType ? err.errorType : "error",
        message: err.message,
        tags: err.tags,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      });
    } else
      return res.status(500).json({
        success: false,
        code: 500,
        status: "error",
        message: "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      });
  }
}
