import { Employee, EmployeeTask } from "@prisma/client";
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
  }) {
    const tasks = await prisma.employeeTask.findMany({
      where: {
        company_branch_id,
        title: title
          ? {
              contains: title,
              mode: "insensitive",
            }
          : undefined,
        employee: {
          hasResigned: false,
          // NOT: {
          //   resign_date: null,
          // },
          delete_at: null,
        },
        end_date: {
          lte: end_date ? new Date(end_date) : undefined,
        },
        start_date: {
          gte: start_date ? new Date(start_date) : undefined,
        },
      },
      select: {
        task_id: true,
        company_branch_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        employee_id: true,
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
        employee: {
          select: {
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
      orderBy: {
        end_date: "desc",
      }
    });

    return tasks;
  }

  static async addTaskManagement(
    company_branch_id: string,
    data: CreateTaskRequest,
    employee_id: string,
    owner_id: string
  ): Promise<Number> {
    const request: CreateTaskRequest = Validation.validate(
      TaskManagementValidation.CREATE_TASK,
      data
    );
    let userGive: Employee | null;

    if (owner_id) {
      userGive = await prisma.employee.findFirst({
        where: {
          company_branch_id,
          employee_id: owner_id,
        },
      });

      if (!userGive) {
        userGive = await prisma.employee.findFirst({
          where: {
            company_branch_id,
            job_position: {
              name: "Owner",
            },
          },
        });
      }
    } else {
      userGive = await prisma.employee.findFirst({
        where: {
          company_branch_id,
          employee_id,
        },
      });
    }

    if (!userGive)
      throw new ErrorResponse("Invalid Unique ID", 400, ["from", "token"]);

    if (request.all_assignes) {
      const employees = await prisma.employee.findMany({
        where: {
          company_branch_id,
          hasResigned: false,
          delete_at: null,
          job_position: {
            name: {
              not: "Owner",
            },
          },
        },
        select: {
          employee_id: true,
        },
      });

      const task = await prisma.employeeTask.createMany({
        data: employees.map((employee) => ({
          company_branch_id,
          employee_id: employee.employee_id,
          title: request.title,
          description: request.description,
          start_date: new Date(request.start_date),
          end_date: new Date(request.end_date),
          given_by_id: userGive!.employee_id,
        })),
      });

      return task.count;
    } else if (request.employee_id) {
      const allEmployees = await prisma.employee.findMany({
        where: {
          company_branch_id,
          employee_id: {
            in: request.employee_id,
          },
          hasResigned: false,
          delete_at: null,
        },
        select: {
          employee_id: true,
        },
      });

      if (allEmployees.length !== request.employee_id.length)
        throw new ErrorResponse("Invalid Employee ID", 400, ["employee_id"]);

      const task = await prisma.employeeTask.createMany({
        data: request.employee_id.map((employee_id) => ({
          company_branch_id,
          employee_id,
          title: request.title,
          description: request.description,
          start_date: new Date(request.start_date),
          end_date: new Date(request.end_date),
          given_by_id: userGive!.employee_id,
        })),
      });

      return task.count;
    } else {
      throw new ErrorResponse("Please fill one out of two options (all_assignes, employee_id)", 400, ["employee_id"]);
    }
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
