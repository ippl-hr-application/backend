import { $Enums } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  employee_file: {
    file_url: string;
  } | null;
};

export type GetByIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
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
};
