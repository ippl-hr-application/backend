import { SubmissionStatus } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  mutasi_data: {
    submission_id: number;
    submission_date: Date;
    status: SubmissionStatus;
    type: string;
    employee: {
      first_name: string;
      last_name: string;
      employee_id: string;
    };
    employee_file: {
      file_url: string;
    } | null;
  }[];
  num_not_validated: number;
};

export type GetByIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  status: SubmissionStatus;
  employee: {
    first_name: string;
    last_name: string;
    employee_id: string;
  };
  employee_file: {
    file_url: string;
  } | null;
  mutation_submission: {
    mutation_reason: string;
    current_company_branch: {
      company_branch_id: string;
      city: string | null;
    };
    target_company_branch: {
      company_branch_id: string;
      city: string | null;
    };
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";

  company_branch_id: string;
};
