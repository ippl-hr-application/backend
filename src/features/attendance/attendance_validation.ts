import { ZodType, z } from "zod";

export class AttendanceValidation {
  static readonly CHECK_IN: ZodType = z.object({
    shift_id: z.number(),
    long: z.number(),
    lat: z.number(),
  });
}
