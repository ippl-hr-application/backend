import { z, ZodType } from 'zod';

export class AccountValidation {
  static readonly createEmployee = z.object({
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

  static updateEmployee = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    bank_account_number: z.string().max(20),
    bank_type: z.string().max(20),
    wage: z.number(),
  });

  static deleteEmployee = z.object({
    id: z.number(),
  });
}