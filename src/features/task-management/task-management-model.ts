import { EmployeeTask } from "@prisma/client";

export type CreateTaskRequest = {
  company_branch_id: string;
  employee_id: string[];
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
};

export type UpdateTaskRequest = Omit<CreateTaskRequest, "company_branch_id" | "task_id" | "employee_id">;
