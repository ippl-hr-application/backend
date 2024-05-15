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
  attendance_submission: {
    reason: string;
    attendance_submission_id: number;
    attendance: {
      date: Date;
      attendance_check: {
        type: $Enums.AttendanceCheckType;
        time: string;
        status: $Enums.AttendanceCheckStatus;
      }[];
    };
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
};
