import { z, ZodType } from "zod";

export class SubmissionValidation {
  static readonly SICK_LETTER: ZodType = z.object({
    permission_reason: z.string().max(100),
    type: z.enum(["IZIN", "SAKIT"]),
  });
  static readonly LEAVE_LETTER: ZodType = z.object({
    leave_reason: z.string().max(100),
    leave_type: z.string(),
    unique_id: z.string(),
  });
  static readonly MUTATION_LETTER: ZodType = z.object({
    mutation_reason: z.string().max(100),
    unique_id: z.string(),
  });
}
