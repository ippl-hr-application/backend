import { NextFunction, Request, Response } from 'express';
import { EmploymentStatusService } from './employmentService';

export class EmploymentController {
  static async getEmploymentStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id = parseInt(req.params.company_branch_id);
      const employmentStatus = await EmploymentStatusService.getEmploymentStatus({
        company_branch_id
      });
      res.status(200).json({
        success: true,
        data: {
          employmentStatus,
        },
        message: 'Employment status retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEmploymentStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employmentStatus = await EmploymentStatusService.createEmploymentStatus(
        req.body
      );
      res.status(201).json({
        success: true,
        data: {
          employmentStatus,
        },
        message: 'Employment status created successfully',
      });
    } catch (error) {
      next(error);
    }
  }  
}