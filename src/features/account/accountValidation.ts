import { z, ZodType } from 'zod';

export class AccountValidation {
  static readonly CREATE_EMPLOYEE: ZodType = z.object({
    employee_id: z.string().min(3).max(20),
    company_branch_id: z.number(),
    job_position_id: z.number(),
    employment_status_id: z.number(),
    unique_id: z.string().min(3).max(20),
    first_name: z.string().min(3).max(50),
    last_name: z.string().min(3).max(50),
    email: z.string().email(),
    address: z.string(),
    password: z.string().min(6).max(20),
    phone_number: z.string().min(10).max(15),
    place_of_birth: z.string(),
    date_of_birth: z.date(),
    marital_status: z.string().max(20),
    blood_type: z.string().min(1).max(3),
    religion: z.string().min(3).max(20),
    identity_type: z.string().min(3).max(20),
    identity_number: z.string().min(3).max(20),
    identity_expired_date: z.date(),
    postcal_code: z.string().min(3).max(10),
    citizen_id_address: z.string(),
    residential_address: z.string(),
    bank_account_number: z.string().max(20),
    bank_type: z.string().max(20),
    wage: z.number(),
  })

  static readonly UPDATE_EMPLOYEE: ZodType = z.object({
    employee_id: z.string().min(3).max(20),
    company_branch_id: z.number(),
    job_position_id: z.number(),
    employment_status_id: z.number(),
    first_name: z.string().min(3).max(50),
    last_name: z.string().min(3).max(50),
    email: z.string().email(),
    address: z.string(),
    password: z.string().min(6).max(20),
    phone_number: z.string().min(10).max(15),
    place_of_birth: z.string(),
    date_of_birth: z.date(),
    marital_status: z.string().max(20),
    blood_type: z.string().min(1).max(3),
    religion: z.string().min(3).max(20),
    identity_type: z.string().min(3).max(20),
    identity_number: z.string().min(3).max(20),
    identity_expired_date: z.date(),
    postcal_code: z.string().min(3).max(10),
    citizen_id_address: z.string(),
    residential_address: z.string(),
    bank_account_number: z.string().max(20),
    bank_type: z.string().max(20),
    wage: z.number(),
  });
  

  static DELETE_EMPLOYEE: ZodType = z.object({
    employee_id: z.string(),
    company_branch_id: z.number(),
  });
}