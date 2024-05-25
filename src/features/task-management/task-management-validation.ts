import { z, ZodType } from "zod";

export class TaskManagementValidation {
  static readonly CREATE_TASK: ZodType = z.object({
    employee_id: z.string().uuid().array().min(1).optional(),
    all_assignes: z.boolean().optional().default(false),
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(255),
    start_date: z.string(),
    end_date: z.string(),
  });

  static readonly UPDATE_TASK: ZodType = z.object({
    title: z.string().min(3).max(50).optional(),
    description: z.string().min(3).max(255).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  });
  static readonly GET_TASK_BY_ID: ZodType = z.object({
    task_id: z.number(),
  });
}
