import { z, ZodType } from "zod";

export class AccountValidation {
  static readonly CREATE_EMPLOYEE: ZodType = z.object({
    company_branch_id: z.string(),
    job_position_id: z.number(),
    employment_status_id: z.number(),
    first_name: z.string().min(3).max(50),
    last_name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    phone_number: z.string().min(10).max(15),
    place_of_birth: z.string(),
    birth_date: z.date().optional(),
    marital_status: z.string().max(20),
    blood_type: z.string().min(1).max(3),
    religion: z.string().min(3).max(20),
    identity_type: z.string().min(3).max(20).optional(),
    identity_number: z.string().min(3).max(20).optional(),
    identity_expired_date: z.date().optional(),
    postcal_code: z.string().min(3).max(10),
    citizen_id_address: z.string(),
    residential_address: z.string(),
    bank_account_number: z.string().max(20).optional(),
    bank_type: z.string().max(20).optional(),
    wage: z.number(),
    gender: z.string().max(10),
    join_date: z.date().optional(),
  });

  static readonly UPDATE_EMPLOYEE: ZodType = z.object({
    employee_id: z.string().min(3).max(50),
    company_branch_id: z.string().optional(),
    job_position_id: z.number().optional(),
    employment_status_id: z.number().optional(),
    first_name: z.string().min(3).max(50).optional(),
    last_name: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    phone_number: z.string().min(10).max(15).optional(),
    marital_status: z.string().max(20).optional(),
    blood_type: z.string().min(1).max(3).optional(),
    religion: z.string().min(3).max(20).optional(),
    identity_type: z.string().min(3).max(20).optional(),
    identity_number: z.string().min(3).max(20).optional(),
    identity_expired_date: z.date().optional(),
    postcal_code: z.string().min(3).max(10).optional(),
    citizen_id_address: z.string().optional(),
    residential_address: z.string().optional(),
    bank_account_number: z.string().max(20).optional(),
    bank_type: z.string().max(20).optional(),
    wage: z.number().optional(),
    hasResigned: z.string().optional(),
    gender: z.string().max(10).optional(),
    join_date: z.date().optional(),
  });

  static DELETE_EMPLOYEE: ZodType = z.object({
    employee_id: z.string(),
    company_branch_id: z.string(),
  });
}
