import { EmployeeTask } from "@prisma/client";

export type CreateTaskRequest = {
  company_branch_id: string;
  employee_id: string[];
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};

export type UpdateTaskRequest = Omit<
  CreateTaskRequest,
  "company_branch_id" | "task_id" | "employee_id"
>;

export type GetTaskEmployeeRequest = {
  employee_id: string;
  start_date: string;
  end_date: string;
};
