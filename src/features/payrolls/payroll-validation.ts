import { z, ZodType } from "zod";

export class PayrollValidation {
  static readonly GET_PAYROLL: ZodType = z.object({
    company_branch_id: z.string(),
    company_id: z.string().optional(),
    month: z.number(),
    year: z.number(),
  });

  static readonly GET_USER_PAYROLL: ZodType = z.object({
    company_branch_id: z.string(),
    employee_id: z.string(),
    year: z.number(),
  });

  static readonly CREATE_PAYROLL: ZodType = this.GET_PAYROLL;

}
