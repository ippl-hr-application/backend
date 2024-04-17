import { z, ZodType } from "zod";

export class TemplateValidation {
  static readonly ADD_NEW_TEMPLATE_DOCUMENT: ZodType = z.object({
    company_id: z.string(),
    description: z.string(),
  }) 
}