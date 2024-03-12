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
    company_branch_id: number;
  }): Promise<EmployeeTask[]> {
    const isCompanyBranchExist = await prisma.companyBranches.findFirst({
      where: { company_branch_id },
    });

    if (!isCompanyBranchExist)
      throw new ErrorResponse("Company Branch not found", 400, ["company_branch_id"]);

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
      where: { employee_id: from },
    });

    if (!userGive)
      throw new ErrorResponse("Invalid Unique ID", 400, ["from", "unique_id"]);

    const isEmployeeExist = await prisma.employee.findFirst({
      where: { employee_id: request.employee_id },
    });

    if (!isEmployeeExist)
      throw new ErrorResponse("Employee not found", 400, ["employee_id"]);

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
      company_branch_id: number;
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
    company_branch_id: number
  ): Promise<EmployeeTask> {
    const isTaskExist = await prisma.employeeTask.findFirst({
      where: { task_id, company_branch_id },
    });

    if (!isTaskExist)
      throw new ErrorResponse("Task not found", 400, ["task_id", "company_branch_id"]);

    const task = await prisma.employeeTask.delete({
      where: { task_id, company_branch_id },
    });

    return task;
  }
}
