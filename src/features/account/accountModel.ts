import {
  Employee,
  EmploymentStatus,
  JobPosition,
  EmployeeTask,
  EmployeeFile,
} from "@prisma/client";

export type GetEmployeeRequest = {
  company_branch_id: string;
};

export type GetEmployeeResponse = Employee[];

export type CreateRequest = {
  company_branch_id: string;
  job_position_id: number;
  employment_status_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  place_of_birth: string;
  birth_date: Date;
  marital_status: string;
  blood_type: string;
  religion: string;
  identity_type: string;
  identity_number: string;
  identity_expired_date: Date;
  postcal_code: string;
  citizen_id_address: string;
  residential_address: string;
  bank_account_number?: string;
  bank_type?: string;
  wage: number;
};

export type CreateResponse = {
  first_name: string;
  last_name: string;
};

export type UpdateRequest = {
  employee_id: string;
  company_branch_id?: string;
  job_position_id?: number;
  employment_status_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  // place_of_birth: string;
  // birth_date: Date;
  marital_status?: string;
  blood_type?: string;
  religion?: string;
  identity_type?: string;
  identity_number?: string;
  identity_expired_date?: Date;
  postcal_code?: string;
  citizen_id_address?: string;
  residential_address?: string;
  bank_account_number?: string;
  bank_type?: string;
  wage?: number;
};

export type UpdateResponse = {
  employee_id: string;
  first_name: string;
  last_name: string;
};

export type DeleteRequest = {
  employee_id: string;
  company_branch_id: string;
};

export type DeleteResponse = {
  employee_id: string;
  first_name: string;
};