import { NextFunction, Request, Response } from 'express';
import { AccountService } from './accountService';

export class AccountController {
  static async getAllEmployees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id = parseInt(req.params.company_branch_id);
      const employees = await AccountService.getAllEmployees(company_branch_id);
      // atau pake local user daripada pake params
      // const { company_branch_id } = res.locals.user;
      // const employees = await AccountService.getAllEmployees(company_branch_id);
      res.status(200).json({
        success: true,
        data: {
          employees,
        },
        message: 'Employees retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      // const company_branch_id = res.locals.user.company_branch_id;
      const employee = await AccountService.createEmployee(req.body);
      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      // const employeeId = req.params.employee_id;
      // const companyBranchId = parseInt(req.params.company_branch_id);

      // atau pake local user daripada pake params
      // const { company_branch_id } = res.locals.user;

      // kalo pake params
      // const employee = await AccountService.updateEmployee(companyBranchId, employeeId, req.body);

      // const employee = await AccountService.updateEmployee(req.body.company_branch_id, req.body.employee_id, req.body);

      const employee = await AccountService.updateEmployee(req.body);
      res.status(200).json({
        success: true,
        data: employee,
        message: 'Employee updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const company_branch_id = parseInt(req.params.company_branch_id);
      const deletingEmployee = await AccountService.deleteEmployee({
        company_branch_id,
        employee_id,
      });
      // await AccountService.deleteEmployee(id);
      res.status(200).json({
        success: true,
        data: deletingEmployee,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJobPositions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id = parseInt(req.params.company_branch_id);
      const jobPositions = await AccountService.jobPositionList(
        company_branch_id
      );
      res.status(200).json({
        success: true,
        data: jobPositions,
        message: 'Job positions retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async createJobPosition(){}

  static async getEmploymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const company_branch_id = parseInt(req.params.company_branch_id);
      const employmentStatus = await AccountService.employmentStatusList(
        company_branch_id
      );
      res.status(200).json({
        success: true,
        data: employmentStatus,
        message: 'Employment status retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEmploymentStatus(){}
  

}
