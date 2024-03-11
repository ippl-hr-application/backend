import { EmployeeTask } from "@prisma/client";

export type CreateTaskRequest = Omit<EmployeeTask, "given_by_id" | "task_id">;
