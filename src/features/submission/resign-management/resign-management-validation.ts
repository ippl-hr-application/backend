import { ZodType, z } from "zod";

export class ResignManagementValidation {
  static readonly GET_ALL_BY_COMPANY_BRANCH_ID: ZodType = z.object({
    company_branch_id: z.string(),
  });
  static readonly GET_BY_ID: ZodType = z.object({
    submission_id: z.number(),
    company_branch_id: z.string(),
  });
  static readonly VALIDATE: ZodType = z.object({
    submission_id: z.number(),
    status: z.enum(["ACCEPTED", "REJECTED", "PENDING"]),
    company_branch_id: z.string(),
  });
}
