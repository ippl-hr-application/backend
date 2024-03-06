import { NextFunction, Request, Response } from 'express';
import { AccountService } from './accountService';

export class AccountController {
  static async getAllEmployees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company_branch_id  = parseInt(req.params.company_branch_id);
      const employees = await AccountService.getAllEmployees(company_branch_id);
      // atau pake local user daripada pake params
      // const { company_branch_id } = res.locals.user;
      // const employees = await AccountService.getAllEmployees(company_branch_id);
      res.status(200).json({
        success: true,
        data: { employees }
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(
    req: Request, 
    res: Response, 
    next: NextFunction
    ) {
    try {
      // const employee = await AccountService.createEmployee(req.body);
      // res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(
    req: Request, 
    res: Response, 
    next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      // const employee = await AccountService.updateEmployee(id, req.body);
      // res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(
    req: Request, 
    res: Response, 
    next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      // await AccountService.deleteEmployee(id);
      // res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
