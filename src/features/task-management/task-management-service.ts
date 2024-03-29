import { EmployeeTask } from "@prisma/client";
import { prisma } from "../../applications";
import { Validation } from "../../validations";
import { CreateTaskRequest, UpdateTaskRequest } from "./task-management-model";
import { TaskManagementValidation } from "./task-management-validation";
import { ErrorResponse } from "../../models";

export class TaskManagementService {
  static async getTaskManagementFromCompany({
    company_branch_id,
  }: {
    company_branch_id: string;
  }): Promise<EmployeeTask[]> {
    const tasks = await prisma.employeeTask.findMany({
      where: { company_branch_id },
    });

    return tasks;
  }

  static async addTaskManagement(
    data: CreateTaskRequest,
    from: string
  ): Promise<EmployeeTask> {
    const request: CreateTaskRequest = Validation.validate(
      TaskManagementValidation.CREATE_TASK,
      data
    );

    const userGive = await prisma.employee.findFirst({
      where: { company_branch_id: from },
    });

    if (!userGive)
      throw new ErrorResponse("Invalid Unique ID", 400, ["from", "unique_id"]);

    const task = await prisma.employeeTask.create({
      data: {
        ...request,
        given_by_id: userGive?.employee_id!,
      },
    });

    return task;
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
