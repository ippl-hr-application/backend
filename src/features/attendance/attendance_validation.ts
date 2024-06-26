import { ZodType, z } from "zod";

export class AttendanceValidation {
  static readonly CHECK_IN: ZodType = z.object({
    assign_shift_id: z.number(),
  });
  static readonly CHECK_OUT: ZodType = z.object({
    attendance_id: z.number(),
  });
  static readonly GET_RECAP: ZodType = z.object({
    month: z.string(),
    year: z.string(),
  });
  static readonly GET_HISTORY: ZodType = z.object({
    date: z.date(),
  });
}
