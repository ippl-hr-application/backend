import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../models";
import multer from "multer";

export class ErrorMiddleware {
  static async notFound(_req: Request, _res: Response, next: NextFunction) {
    const error = new ErrorResponse("Not Found", 404, ["route"]);
    next(error);
  }

  static async returnError(
    err: Error | ErrorResponse | multer.MulterError,
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
    }

    if (err instanceof ErrorResponse) {
      return res.status(err.statusCode).json({
        success: false,
        code: err.statusCode,
        status: "error",
        message: err.message,
        tags: err.tags,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      });
    }

    return res.status(500).json({
      success: false,
      code: 500,
      status: "error",
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }
}
