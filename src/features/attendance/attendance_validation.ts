import { ZodType, z } from "zod";

export class AttendanceValidation {
  static readonly CHECK_IN: ZodType = z.object({
    shift_id: z.number(),
    long: z.number(),
    lat: z.number(),
  });
  static readonly GET_RECAP: ZodType = z.object({
    month_and_year: z.string(),
  });
}
