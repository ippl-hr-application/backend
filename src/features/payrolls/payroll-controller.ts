import { NextFunction, Request, Response } from "express";
import { PayrollService } from "./payroll-service";
import { EmployeeToken } from "../../models";

export class PayrollController {
  static async getPayrolls(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id: company_branch_id } = res.locals
        .user as EmployeeToken;
      const { month, year } = req.query;
      const [payrolls, totalWage] = await PayrollService.getPayrolls({
        company_branch_id,
        month: Number(month),
        year: Number(year),
      });

      return res.status(200).json({
        success: true,
        data: { payrolls, total_wage: totalWage },
        message: "Payrolls fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserPayrolls(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { employee_id } = res.locals
        .user as EmployeeToken;
      const { year } = req.query;

      const payrolls = await PayrollService.getUserPayrolls({
        company_branch_id,
        employee_id,
        year: Number(year),
      });

      return res.status(200).json({
        success: true,
        data: { payrolls },
        message: "User payrolls fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = req.params;
      const { month, year } = req.body;
      const payrolls = await PayrollService.createPayroll({
        company_branch_id,
        month,
        year,
      });

      return res.status(201).json({
        success: true,
        data: { payrolls },
        message: "Payroll created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id, company_branch_id } = req.params;
      const { status } = req.body;
      const payroll = await PayrollService.updatePayroll({
        company_branch_id,
        payroll_id,
        status,
      });

      return res.status(200).json({
        success: true,
        data: { payroll },
        message: "Payroll updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;
      await PayrollService.deletePayroll(payroll_id);

      return res.status(200).json({
        success: true,
        message: "Payroll deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
