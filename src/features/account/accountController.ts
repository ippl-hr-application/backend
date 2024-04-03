import { NextFunction, Request, Response } from "express";
import { AccountService } from "./accountService";
import { boolean } from "zod";

export class AccountController {
  static async getAllEmployees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id = req.params.company_branch_id;
      const first_name = req.query.first_name as string;
      const last_name = req.query.last_name as string;
      const hasResigned = req.query.hasResigned as string;
      const gender = req.query.gender as string;
      const job_position = req.query.job_position as string;
      const employment_status = req.query.employment_status as string;
      const employees = await AccountService.getAllEmployees({
        company_branch_id,
        hasResigned,
        first_name,
        last_name,
        gender,
        job_position,
        employment_status,
      });
      res.status(200).json({
        success: true,
        data: {
          employees,
        },
        message: "Employees retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const company_branch_id = req.params.company_branch_id;
      const employee = await AccountService.searchEmployee({
        employee_id,
        company_branch_id,
      });
      res.status(200).json({
        success: true,
        data: employee,
        message: "Employee retrieved successfully",
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
        message: "Employee created successfully",
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
        message: "Employee updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const company_branch_id = req.params.company_branch_id;
      const deletingEmployee = await AccountService.deleteEmployee({
        company_branch_id,
        employee_id,
      });
      res.status(200).json({
        success: true,
        data: deletingEmployee,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // static async softDeleteEmployee(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { employee_id, company_branch_id } = req.body;
  //     const softDeleteEmployee = await AccountService.softDeleteEmployee({
  //       employee_id,
  //       company_branch_id,
  //     });
  //     return res.status(200).json({
  //       success: true,
  //       data: softDeleteEmployee,
  //       message: "Successfully soft delete employee",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async employeeResign(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, company_branch_id } = req.body;
      const resignEmployee = await AccountService.employeeResign({
        employee_id,
        company_branch_id,
      });
      return res.status(200).json({
        success: true,
        data: resignEmployee,
        message: "Successfully make employee resign",
      });
    } catch (error) {
      next(error);
    }
  }
}
