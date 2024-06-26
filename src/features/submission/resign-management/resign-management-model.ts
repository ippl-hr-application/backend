import { $Enums } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  status: $Enums.SubmissionStatus;
  employee_file: {
    file_url: string;
  } | null;
  employee: {
    first_name: string;
    last_name: string;
    employee_id: string;
  };
};

export type GetByIdResponse = {
  submission_id: number;
  submission_date: Date;
  status: $Enums.SubmissionStatus;
  type: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_id: string;
  };
  employee_file: {
    file_url: string;
  } | null;
  resign_submission: {
    resign_submission_id: number;
    reason: string;
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";

  company_branch_id: string;
};
