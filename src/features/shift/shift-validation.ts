import { z, ZodType } from "zod";

export class ShiftValidation {
  static readonly ADD_SHIFT: ZodType = z.object({
    name: z.string(),
    end_time: z.string(),
    start_time: z.string(),
  });
  static readonly DELETE_SHIFT: ZodType = z.object({
    shift_id: z.number(),
  });
  static readonly ADD_ASSIGN_SHIFT: ZodType = z.object({
    shift_id: z.number(),
    employee_id: z.string(),
  });
  static readonly UPDATE_ASSIGN_SHIFT: ZodType = z.object({
    shift_id: z.number(),
    employee_id: z.string(),
  });
}
