import { EmployeeTask } from "@prisma/client";

export type CreateTaskRequest = Omit<EmployeeTask, "given_by_id" | "task_id">;

export type UpdateTaskRequest = Omit<CreateTaskRequest, "company_branch_id" | "task_id" | "employee_id">;
