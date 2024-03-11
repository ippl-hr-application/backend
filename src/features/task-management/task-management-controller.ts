import { NextFunction, Request, Response } from "express";
import { TaskManagementService } from "./task-management-service";

export class TaskManagementController {
  static async getTaskManagementFromCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const tasks = await TaskManagementService.getTaskManagementFromCompany({
        company_branch_id: Number(company_branch_id),
      });

      return res.status(201).json({
        success: true,
        data: { tasks },
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTaskManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body;
      const task = await TaskManagementService.addTaskManagement(
        data,
        res.locals.user.unique_id
      );
      return res.status(201).json({
        success: true,
        data: { task },
        message: "Task added successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
