import { EmployeeTask } from "@prisma/client";
import { prisma } from "../../applications";
import { Validation } from "../../validations";
import { CreateTaskRequest } from "./task-management-model";
import { TaskManagementValidation } from "./task-management-validation";

export class TaskManagementService {
  static async getTaskManagementFromCompany({
    company_branch_id,
  }: {
    company_branch_id: number;
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

    const task = await prisma.employeeTask.create({
      data: {
        ...request,
        given_by_id: from,
      },
    });

    return task;
  }
}
