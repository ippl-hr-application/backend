import { EmployeeTask } from "@prisma/client";
import { prisma } from "../../applications";
import { Validation } from "../../validations";
import { CreateTaskRequest, UpdateTaskRequest } from "./task-management-model";
import { TaskManagementValidation } from "./task-management-validation";
import { ErrorResponse } from "../../models";

export class TaskManagementService {
  static async getTaskManagementFromCompany({
    company_branch_id,
    start_date,
    end_date,
  }: {
    company_branch_id: string;
    [key: string]: string;
  }): Promise<EmployeeTask[]> {
    console.log(start_date, end_date);
    const tasks = await prisma.employeeTask.findMany({
      where: {
        company_branch_id,
        end_date: {
          lte: end_date ? new Date(end_date) : undefined,
        },
        start_date: {
          gte: start_date ? new Date(start_date) : undefined,
        },
      },
    });

    return tasks;
  }

  static async addTaskManagement(
    data: CreateTaskRequest,
    from: string
  ): Promise<Number> {
    const request: CreateTaskRequest = Validation.validate(
      TaskManagementValidation.CREATE_TASK,
      data
    );

    const userGive = await prisma.employee.findFirst({
      where: {
        employee_id: from,
      },
    });

    if (!userGive)
      throw new ErrorResponse("Invalid Unique ID", 400, ["from", "unique_id"]);

    const task = await prisma.employeeTask.createMany({
      data: request.employee_id.map((employee_id) => ({
        company_branch_id: request.company_branch_id,
        employee_id,
        title: request.title,
        description: request.description,
        start_date: new Date(request.start_date),
        end_date: new Date(request.end_date),
        given_by_id: from,
      })),
    });

    console.log(task.count);

    return task.count;
  }

  static async updateTaskManagement(
    {
      task_id,
      company_branch_id,
    }: {
      task_id: number;
      company_branch_id: string;
    },
    data: UpdateTaskRequest
  ): Promise<EmployeeTask> {
    const request: UpdateTaskRequest = Validation.validate(
      TaskManagementValidation.UPDATE_TASK,
      data
    );

    const task = await prisma.employeeTask.update({
      where: { task_id, company_branch_id },
      data: request,
    });

    return task;
  }

  static async deleteTaskManagement(
    task_id: number,
    company_branch_id: string
  ): Promise<EmployeeTask> {
    const task = await prisma.employeeTask.delete({
      where: { task_id, company_branch_id },
    });

    return task;
  }
}
