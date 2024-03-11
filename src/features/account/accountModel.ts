import {
  Employee,
  EmploymentStatus,
  JobPosition,
  EmployeeTask,
  EmployeeFile,
} from '@prisma/client';

// export type EmployeeWithRelations = Employee & {
//   employment_status: EmploymentStatus;
//   job_position: JobPosition;
//   employee_task: EmployeeTask[];
//   employee_file: EmployeeFile[];
// };

// type religion_type = "Islam" | "Protestan" | "Catholic" | "Hindu" | "Buddha" | "Konghucu" | "Others";
// type marital_status_type = "Single" | "Married" | "Widow" | "Widower" | "Others" ;
// type blood_type = "A" | "B" | "AB" | "O" | "Others";

export type GetEmployeeRequest = {
  company_branch_id: number;
};

export type GetEmployeeResponse = Employee[];

export type CreateRequest = {
  company_branch_id: number;
  job_position_id: number;
  job_position_name: string;
  employment_status_id: number;
  employment_status_name: string;
  unique_id: string;
  first_name: string;
  last_name: string;
  address: string;
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
  employee_id: string;
  first_name: string;
  last_name: string;
};

export type UpdateRequest = {
  employee_id: string;
  company_branch_id?: number;
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
  company_branch_id: number;
};

export type DeleteResponse = {
  employee_id: string;
  first_name: string;
};

export type JobPositionRequest = {
  company_branch_id: number;
};

export type JobPositionResponse = JobPosition[];

export type EmploymentStatusRequest = {
  company_branch_id: number;
};

export type EmploymentStatusResponse = EmploymentStatus[];
