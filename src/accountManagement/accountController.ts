import { NextFunction, Request, Response } from 'express';
import * as AccountService from './accountService';

export class AccountController {
  static async getEmployees(req: Request, res: Response, next: NextFunction){
    try {
      const employees = await AccountService.findAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'error',
        message: error
      });
    }
  };

  static async createEmployee(req: Request, res: Response){
    try {
      const employee = await AccountService.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'error',
        message: error
      });
    }
  };

  static async updateEmployee(req: Request, res: Response){
    const id = parseInt(req.params.id);
    try {
      const employee = await AccountService.updateEmployee(id, req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'error',
        message: error
      });
    }
  };

  static async deleteEmployee(req: Request, res: Response){
    const id = parseInt(req.params.id);
    try {
      await AccountService.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'error',
        message: error
      });
    }
  };
}