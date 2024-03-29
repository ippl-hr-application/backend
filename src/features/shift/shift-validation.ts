import { z, ZodType } from "zod";

export class ShiftValidation {
  static readonly ADD_SHIFT: ZodType = z.object({
    company_branch_id: z.string(),
    name: z.string(),
    end_time: z.string(),
    start_time: z.string(),
  });
}
