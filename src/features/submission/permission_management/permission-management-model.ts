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
};