import { NextFunction, Request, Response } from "express";
import { TaskManagementService } from "./task-management-service";
import { EmployeeToken } from "../../models";

export class TaskManagementController {
  static async getTaskManagementFromCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id } = res.locals.user as EmployeeToken;
      const { start_date, end_date } = req.query;
      const tasks = await TaskManagementService.getTaskManagementFromCompany({
        company_branch_id: company_id,
        start_date: start_date as string,
        end_date: end_date as string,
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
      const { employee_id: given_by_employee_id } = res.locals
        .user as EmployeeToken;
      const task_created = await TaskManagementService.addTaskManagement(
        data,
        given_by_employee_id
      );
      return res.status(201).json({
        success: true,
        data: { task_created },
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
      const { task_id } = req.params;
      const { company_branch_id } = res.locals.user as EmployeeToken;
      const data = req.body;
      const task = await TaskManagementService.updateTaskManagement(
        {
          task_id: Number(task_id),
          company_branch_id: company_branch_id,
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
      const { task_id } = req.params;
      const { company_branch_id } = res.locals.user as EmployeeToken;
      await TaskManagementService.deleteTaskManagement(
        Number(task_id),
        company_branch_id
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
