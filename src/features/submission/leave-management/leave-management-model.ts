import { $Enums } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  employee_file: {
    file_url: string | undefined;
  };
};

export type GetByIdResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  employee_file: {
    file_url: string;
  } | null;
  leave_submission: {
    from: Date;
    to: Date;
    leave_reason: string;
    leave_permission_id: number;
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
};