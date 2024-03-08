import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
  });

  static readonly EMPLOYEE_LOGIN: ZodType = z.object({
    uniqueId: z.string().min(3).max(50),
    password: z.string().min(6).max(20),
  });

  static readonly REGISTER: ZodType = z.object({
    full_name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    phone_number: z.string().min(10).max(15),
    company_name: z.string().min(3).max(50),
    industry: z.string().optional(),
  });

  static readonly RESET_PASSWORD: ZodType = z.object({
    email: z.string().email(),
    newPassword: z.string().min(6).max(20),
  });
}
