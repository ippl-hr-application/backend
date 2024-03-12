import {
  EmploymentStatus
} from '@prisma/client'

export type CreateEmploymentStatusRequest = {
  company_branch_id: number;
  name: string;
};

export type CreateEmploymentStatusResponse = {
  employment_status_id: number;
  company_branch_id: number;
  name: string;
};

export type GetEmploymentStatusRequest = {
  company_branch_id: number;
};

export type GetEmploymentStatusResponse = EmploymentStatus[];