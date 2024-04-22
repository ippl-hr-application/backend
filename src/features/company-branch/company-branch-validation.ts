import { z, ZodType } from "zod";

export class CompanyBranchValidation {
  static readonly CREATE_NEW_BRANCH: ZodType = z.object({
    email: z.string().email().optional(),
    phone_number: z.string().min(10).max(15).optional(),
    address: z.string().min(3).max(100).optional(),
    province: z.string().min(3).max(50).optional(),
    city: z.string().min(3).max(50).optional(),
    size: z.number().int().optional(),
    hq_initial: z.string().min(3).max(50),
    hq_code: z.string().min(3).max(50).optional(),
    umr: z.number().int().optional(),
    umr_province: z.number().int().optional(),
    umr_city: z.number().int().optional(),
    bpjs: z.string().min(3).max(50).optional(),
  });

  static readonly EDIT_BRANCH: ZodType = z.object({
    email: z.string().email().optional(),
    phone_number: z.string().min(10).max(15).optional(),
    address: z.string().min(3).max(100).optional(),
    province: z.string().min(3).max(50).optional(),
    city: z.string().min(3).max(50).optional(),
    size: z.number().int().optional(),
    hq_initial: z.string().min(3).max(50).optional(),
    hq_code: z.string().min(3).max(50).optional(),
    umr: z.number().int().optional(),
    umr_province: z.number().int().optional(),
    umr_city: z.number().int().optional(),
    bpjs: z.string().min(3).max(50).optional(),
  });
}
