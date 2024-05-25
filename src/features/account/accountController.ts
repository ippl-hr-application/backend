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
      const job_position_name = req.query.job_position_name as string;
      const employment_status_name = req.query.employment_status_name as string;
      const get_all = req.query.get_all as string;
      const deleted = req.query.deleted as string;
      const employees = await AccountService.getAllEmployees({
        company_branch_id,
        hasResigned,
        first_name,
        last_name,
        gender,
        job_position_name,
        employment_status_name,
        get_all,
        deleted,
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
      const {
        // company_branch_id,
        job_position_id,
        employment_status_id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        place_of_birth,
        birth_date,       
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expired_date,       
        postcal_code,
        citizen_id_address,
        residential_address,
        bank_account_number,
        bank_type,
        wage,
        gender,
        join_date     
      } = req.body;
      const company_branch_id = req.params.company_branch_id || req.body.company_branch_id;
      const employee = await AccountService.createEmployee({
        company_branch_id,
        job_position_id,
        employment_status_id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        place_of_birth,
        birth_date,       
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expired_date,       
        postcal_code,
        citizen_id_address,
        residential_address,
        bank_account_number,
        bank_type,
        wage,
        gender,
        join_date
      });
      res.status(200).json({
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
      const {
        employee_id,
        // company_branch_id,
        job_position_id,
        employment_status_id,
        first_name,
        last_name,
        email,
        phone_number, 
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expired_date,       
        postcal_code,
        citizen_id_address,
        residential_address,
        bank_account_number,
        bank_type,
        wage,
        gender,
        join_date,
        resign_date
      } = req.body;
      const company_branch_id = req.params.company_branch_id || req.body.company_branch_id;
      const employee = await AccountService.updateEmployee({
        employee_id,
        company_branch_id,
        job_position_id,
        employment_status_id,
        first_name,
        last_name,
        email,
        phone_number,
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expired_date,
        postcal_code,
        citizen_id_address,
        residential_address,
        bank_account_number,
        bank_type,
        wage,
        gender,
        join_date,
        resign_date
      });
      res.status(200).json({
        success: true,
        data: employee,
        message: "Employee updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async softDeleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const company_branch_id = req.params.company_branch_id;
      const deletingEmployee = await AccountService.softDeleteEmployee({
        company_branch_id,
        employee_id,
      });
      res.status(200).json({
        success: true,
        data: deletingEmployee,
        message: "Employee soft deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static  async deleteEmployeeFromDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const company_branch_id = req.params.company_branch_id;
      const deletingEmployee = await AccountService.deleteEmployeeFromDatabase({
        company_branch_id,
        employee_id,
      });
      res.status(200).json({
        success: true,
        data: deletingEmployee,
        message: "Employee deleted permanently successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async employeeResign(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        employee_id,
        // company_branch_id 
      } = req.body;
      const company_branch_id = req.params.company_branch_id || req.body.company_branch_id;
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
