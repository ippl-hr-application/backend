import { EmploymentStatus } from '@prisma/client';

export type CreateEmploymentStatusRequest = {
  company_branch_id: string;
  name: string;
};

export type CreateEmploymentStatusResponse = {
  company_branch_id: string;
  name: string;
};

export type GetEmploymentStatusRequest = {
  company_branch_id: string;
};

export type GetEmploymentStatusResponse = EmploymentStatus[];

export type UpdateEmploymentStatusRequest = {
  company_branch_id: string;
  employment_status_id: number;
  name: string;
};

export type UpdateEmploymentStatusResponse = {
  employment_status_id: number;
  name: string;
};