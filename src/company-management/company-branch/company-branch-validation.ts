import { z, ZodType } from "zod";

export class CompanyBranchValidation {
  static readonly CREATE_NEW_BRANCH: ZodType = z.object({
    email: z.string().email().optional().or(z.literal("")),
    phone_number: z.string().min(10).max(15),
    address: z.string().min(3).max(100).optional().or(z.literal("")),
    province: z.string().min(3).max(50).optional().or(z.literal("")),
    city: z.string().min(3).max(50).optional().or(z.literal("")),
    size: z.number().int().optional().or(z.literal("")),
    hq_initial: z.string().min(3).max(50),
    hq_code: z.string().min(3).max(50).optional().or(z.literal("")),
    umr: z.number().int().optional().or(z.literal("")),
    umr_province: z.number().int().optional().or(z.literal("")),
    umr_city: z.number().int().optional().or(z.literal("")),
    bpjs: z.string().min(3).max(50).optional().or(z.literal("")),
    password: z.string().min(8),
  });

  static readonly EDIT_BRANCH: ZodType = z.object({
    email: z.string().email().optional().or(z.literal("")),
    phone_number: z.string().min(10).max(15).optional().or(z.literal("")),
    address: z.string().min(3).max(100).optional().or(z.literal("")),
    province: z.string().min(3).max(50).optional().or(z.literal("")),
    city: z.string().min(3).max(50).optional().or(z.literal("")),
    size: z.number().int().optional().or(z.literal("")),
    hq_initial: z.string().min(3).max(50).optional().or(z.literal("")),
    hq_code: z.string().min(3).max(50).optional().or(z.literal("")),
    umr: z.number().int().optional().or(z.literal("")),
    umr_province: z.number().int().optional().or(z.literal("")),
    umr_city: z.number().int().optional().or(z.literal("")),
    bpjs: z.string().min(3).max(50).optional().or(z.literal("")),
  });
}
