import { $Enums } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  sick_data: {
    submission_id: number;
    submission_date: Date;
    type: string;
    status: $Enums.SubmissionStatus;
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
  status: $Enums.SubmissionStatus;
  employee: {
    first_name: string;
    last_name: string;
    employee_id: string;
  };
  employee_file: {
    file_url: string;
  } | null;
  permission_submission: {
    permission_reason: string;
    from: Date;
    to: Date;
    type: $Enums.PermissionType;
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";

  company_branch_id: string;
};
