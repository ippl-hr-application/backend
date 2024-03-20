import { JobPosition } from '@prisma/client'

export type CreateJobPositionRequest = {
  company_branch_id: string;
  name: string;
};

export type CreateJobPositionResponse = {
  company_branch_id: string;
  name: string;
}

export type GetJobPositionRequest = {
  company_branch_id: string;
}

export type GetJobPositionResponse = JobPosition[]