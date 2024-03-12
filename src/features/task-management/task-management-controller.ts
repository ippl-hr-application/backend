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
        message: "Task Management Retrieved Successfully",
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
        res.locals.user.employee_id
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

  static async updateTaskManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id, task_id } = req.params;
      const data = req.body;
      const task = await TaskManagementService.updateTaskManagement(
        {
          task_id: Number(task_id),
          company_branch_id: Number(company_branch_id),
        },
        data
      );

      return res.status(200).json({
        success: true,
        data: { task },
        message: "Task updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTaskManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id, task_id } = req.params;
      await TaskManagementService.deleteTaskManagement(
        Number(task_id),
        Number(company_branch_id)
      );

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
