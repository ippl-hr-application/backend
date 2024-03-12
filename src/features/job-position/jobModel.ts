export type CreateJobPositionRequest = {
  company_branch_id: number;
  name: string;
};

export type CreateJobPositionResponse = {
  job_position_id: number;
  company_branch_id: number;
  name: string;
}