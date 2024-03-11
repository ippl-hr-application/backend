import { z, ZodType } from "zod";

export class TaskManagementValidation {
  static readonly CREATE_TASK: ZodType = z.object({
    company_branch_id: z.string().uuid(),
    employee_id: z.string().uuid(),
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(255),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
  });
}