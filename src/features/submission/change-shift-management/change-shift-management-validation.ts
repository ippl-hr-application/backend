import { ZodType, z } from "zod";

export class ChangeShiftManagementValidation {
  static readonly GET_ALL_BY_COMPANY_BRANCH_ID: ZodType = z.object({
    company_branch_id: z.string(),
    date: z.date().optional(),
  });
  static readonly GET_BY_ID: ZodType = z.object({
    submission_id: z.number(),
    company_branch_id: z.string(),
  });
  static readonly VALIDATE: ZodType = z.object({
    submission_id: z.number(),
    company_branch_id: z.string(),
    status: z.enum(["ACCEPTED", "REJECTED", "PENDING"]),
  });
}
