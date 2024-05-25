import {z, ZodType} from 'zod';

export class CompanyValidation {
  static readonly EDIT_COMPANY: ZodType = z.object({
    name: z.string().min(3).max(50),
    industry: z.string().min(3).max(50),
    npwp_digit: z.string().min(3).max(50).optional(),
  })
}