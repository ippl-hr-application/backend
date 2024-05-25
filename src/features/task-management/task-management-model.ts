import { EmployeeTask } from "@prisma/client";

export type CreateTaskRequest = {
  company_branch_id: string;
  employee_id?: string[];
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  all_assignes?: boolean;
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
export type GetTaskEmployeeResponse = {
  task_id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  given_by: {
    employee_id: string;
    first_name: string;
    last_name: string;
    job_position: {
      name: string;
    };
  };
};
