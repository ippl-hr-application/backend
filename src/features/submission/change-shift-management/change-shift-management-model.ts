import { SubmissionStatus } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  change_shift_data: {
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
  }[];
} & {
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
  change_shift_submission: {
    change_shift_permission_id: number;
    target_date: Date;
    reason: string;
    current_shift: {
      name: string;
    };
    target_shift: {
      name: string;
    };
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  company_branch_id: string;
};
