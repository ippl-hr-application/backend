import { z, ZodType } from "zod";

export class DocumentValidation {
  static readonly CREATE_DOCUMENT: ZodType = z.object({
    company_id: z.string(),
    description: z.string().optional(),
  });

  static readonly GET_DOCUMENT: ZodType = z.object({
    company_id: z.string(),
  });

  static readonly UPDATE_DOCUMENT: ZodType = z.object({
    company_file_id: z.number(),
    company_id: z.string(),
    file_name: z.string().optional(),
    description: z.string().optional(),
  });

  static readonly DELETE_DOCUMENT: ZodType = z.object({
    company_file_id: z.number(),
  });
}