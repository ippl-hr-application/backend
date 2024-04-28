import { z, ZodType } from 'zod';

export class JobPositionValidation {
  static readonly CREATE_JOB_POSITION: ZodType = z.object({
    company_branch_id: z.string(),
    name: z.string(),
  });

  static readonly UPDATE_JOB_POSITION: ZodType = z.object({
    company_branch_id: z.string(),
    job_position_id: z.number(),
    name: z.string(),
  });
}