import { NextFunction, Request, Response } from "express";
import { JobPositionService } from "./jobService";

export class JobPositionController {
  static async getJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const company_branch_id = parseInt(req.params.company_branch_id);
      const jobPosition = await JobPositionService.getJobPosition({company_branch_id});
      res.status(200).json({
        success: true,
        data: {
          jobPosition,
        },
        message: "Job position retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async createJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const jobPosition = await JobPositionService.createJobPosition(req.body);
      res.status(201).json({
        success: true,
        data: {
          jobPosition,
        },
        message: "Job position created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}