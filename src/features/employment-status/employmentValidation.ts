import { z, ZodType } from 'zod';

export class EmploymentStatusValidation {
  static readonly CREATE_EMPLOYMENT_STATUS: ZodType = z.object({
    company_branch_id: z.string(),
    name: z.string(),
  });

  static readonly UPDATE_EMPLOYMENT_STATUS: ZodType = z.object({
    company_branch_id: z.string(),
    employment_status_id: z.number(),
    name: z.string(),
  });
}
