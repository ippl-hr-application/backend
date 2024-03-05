import { Employee, EmploymentStatus, JobPosition, EmployeeTask, EmployeeFile } from "@prisma/client";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type CreateRequest = {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  password: string;
  phone_number: string;
  place_of_birth: string;
  date_of_birth: Date;
  marital_status: string;
  blood_type: string;
  religion: string;
  identity_type: string;
  identity_number: string;
  identity_expired_date: Date;
  postcal_code: string;
  citizen_id_address: string;
  residential_address: string;
  bank_account_number: string;
  bank_type: string;
  wage: number;
  
};

export type RegisteredUserWithoutPassword = Omit<RegisteredUser, "password">;

export type CurrentLoggedInUserResponse = {
  email: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  package_type: string;
  company: {
    name: string;
    industry: string | null;
  } | null;
};
