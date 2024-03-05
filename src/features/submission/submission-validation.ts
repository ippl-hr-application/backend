import { z, ZodType } from "zod";

export class SubmissionValidation {
  static readonly SICK_LETTER: ZodType = z.object({
    date_and_time: z.date(),
    permission_reason: z.string().max(100),
    type: z.enum(["IZIN", "SAKIT"]),
    employee_id: z.string(),
    permission_file: z.instanceof(File, { message: "File is required" }),
  });
  static readonly LEAVE_LETTER: ZodType = z.object({
    from: z.date(),
    to: z.date(),
    leave_reason: z.string().max(100),
    leave_type: z.string(),
    employee_id: z.string(),
    leave_file: z.instanceof(File, { message: "File is required" }),
  });
  static readonly MUTATION_LETTER: ZodType = z.object({
    mutation_reason: z.string().max(100),
    employee_id: z.string(),
    mutation_file: z.instanceof(File, { message: "File is required" }),
  });
}
