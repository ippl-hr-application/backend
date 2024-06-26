import { NextFunction, Request, Response } from "express";
import { JobPositionService } from "./jobService";
import { EmployeeToken, UserToken } from "../../models";

export class JobPositionController {
  static async getJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const company_branch_id = req.params.company_branch_id;
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
      const { company_branch_id, name } = req.body;
      const { company_id } = res.locals.user as EmployeeToken | UserToken
      const jobPosition = await JobPositionService.createJobPosition({company_id, company_branch_id, name});
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

  static async updateJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id, job_position_id, name } = req.body;
      const { company_id } = res.locals.user as EmployeeToken | UserToken
      const jobPosition = await JobPositionService.updateJobPosition({company_id, company_branch_id, job_position_id, name});
      res.status(200).json({
        success: true,
        data: {
          jobPosition,
        },
        message: "Job position updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_position_id, company_branch_id } = req.body;
      const { company_id } = res.locals.user as EmployeeToken | UserToken
      const jobPosition = await JobPositionService.deleteJobPosition({job_position_id, company_branch_id, company_id});
      res.status(200).json({
        success: true,
        data: {
          jobPosition,
        },
        message: "Job position deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}