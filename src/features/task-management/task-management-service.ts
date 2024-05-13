import { EmployeeTask } from "@prisma/client";
import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
  CreateTaskRequest,
  GetTaskEmployeeRequest,
  GetTaskEmployeeResponse,
  UpdateTaskRequest,
} from "./task-management-model";
import { TaskManagementValidation } from "./task-management-validation";
import { ErrorResponse } from "../../models";
import { GetTaskTemplateResponse } from "aws-sdk/clients/connect";

export class TaskManagementService {
  static async getTaskManagementFromCompany({
    company_branch_id,
    start_date,
    end_date,
    title,
  }: {
    company_branch_id: string;
    start_date: string;
    end_date: string;
    title?: string;
  }): Promise<EmployeeTask[]> {
    console.log(title);
    const tasks = await prisma.employeeTask.findMany({
      where: {
        company_branch_id,
        title: title
          ? {
              contains: title,
              mode: "insensitive",
            }
          : undefined,
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
    company_branch_id: string,
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
        company_branch_id,
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
      data: {
        ...request,
        start_date: new Date(request.start_date),
        end_date: new Date(request.end_date),
      },
    });

    return task;
  }

  static async deleteTaskManagement(
    task_id: number,
    company_branch_id: string
  ): Promise<EmployeeTask> {
    const isTaskExist = await prisma.employeeTask.findUnique({
      where: { task_id, company_branch_id },
    });

    if (!isTaskExist)
      throw new ErrorResponse("Task not found", 404, ["task_id"]);

    const task = await prisma.employeeTask.delete({
      where: { task_id, company_branch_id },
    });

    return task;
  }
  static async getTaskEmployee({
    employee_id,
    start_date,
    end_date,
  }: GetTaskEmployeeRequest): Promise<GetTaskEmployeeResponse[]> {
    const tasks = await prisma.employeeTask.findMany({
      where: {
        employee_id,
        end_date: {
          lte: end_date ? new Date(end_date) : undefined,
        },
        start_date: {
          gte: start_date ? new Date(start_date) : undefined,
        },
      },
      select: {
        task_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        given_by: {
          select: {
            employee_id: true,
            first_name: true,
            last_name: true,
            job_position: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return tasks;
  }
  static async getTaskById(task_id: number): Promise<EmployeeTask> {
    const request = Validation.validate(
      TaskManagementValidation.GET_TASK_BY_ID,
      { task_id }
    );
    const task = await prisma.employeeTask.findUnique({
      where: { task_id: request.task_id },
    });
    if (!task) throw new ErrorResponse("Task not found", 404, ["task_id"]);
    return task;
  }
}
