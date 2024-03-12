export type CreateEmploymentStatusRequest = {
  company_branch_id: number;
  name: string;
};

export type CreateEmploymentStatusResponse = {
  employment_status_id: number;
  company_branch_id: number;
  name: string;
};
