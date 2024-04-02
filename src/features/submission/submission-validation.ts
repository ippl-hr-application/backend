import { z, ZodType } from "zod";

export class SubmissionValidation {
  static readonly SICK_LETTER: ZodType = z.object({
    permission_reason: z.string().max(100),
    type: z.enum(["IZIN", "SAKIT"]),
    from: z.string(),
    to: z.string(),
  });
  static readonly LEAVE_LETTER: ZodType = z.object({
    from: z.string(),
    to: z.string(),
    leave_reason: z.string().max(100),
    leave_type: z.string(),
    employee_id: z.string(),
  });
  static readonly MUTATION_LETTER: ZodType = z.object({
    mutation_reason: z.string().max(100),
    current_company_branch_id: z.string(),
    target_company_branch_id: z.string(),
    employee_id: z.string(),
  });
}
