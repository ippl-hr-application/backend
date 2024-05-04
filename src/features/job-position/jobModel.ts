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

export type UpdateJobPositionRequest = {
  company_branch_id: string;
  job_position_id: number;
  name: string;
}

export type UpdateJobPositionResponse = {
  job_position_id: number;
  name: string;
}

export type DeleteJobPositionRequest = {
  company_branch_id: string;
  job_position_id: number;
}

export type DeleteJobPositionResponse = {
  job_position_id: number;
  name: string;
}