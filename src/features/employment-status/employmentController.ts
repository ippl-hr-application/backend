import { NextFunction, Request, Response } from 'express';
import { EmploymentStatusService } from './employmentService';
import { EmployeeToken, UserToken } from '../../models';

export class EmploymentController {
  static async getEmploymentStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id = req.params.company_branch_id;
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
    const { company_branch_id, name } = req.body;
    const { company_id } = res.locals.user as UserToken | EmployeeToken
    try {
      const employmentStatus = await EmploymentStatusService.createEmploymentStatus({
        company_id,
        company_branch_id,
        name
      });
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

  static async updateEmploymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const employmentStatus = await EmploymentStatusService.updateEmploymentStatus(req.body);
      res.status(200).json({
        success: true,
        data: {
          employmentStatus,
        },
        message: 'Employment status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmploymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { employment_status_id, company_branch_id } = req.body;
      const employmentStatus = await EmploymentStatusService.deleteEmploymentStatus({employment_status_id, company_branch_id});
      res.status(200).json({
        success: true,
        data: {
          employmentStatus,
        },
        message: 'Employment status deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}