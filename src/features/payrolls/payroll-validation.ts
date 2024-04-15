import { z, ZodType } from "zod";

export class PayrollValidation {
  static readonly GET_PAYROLL: ZodType = z.object({
    company_branch_id: z.string(),
    month: z.number(),
    year: z.number(),
  });

  static readonly CREATE_PAYROLL: ZodType = this.GET_PAYROLL;
}
