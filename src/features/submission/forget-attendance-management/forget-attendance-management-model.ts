import { $Enums, SubmissionStatus } from "@prisma/client";

export type GetAllByCompanyBranchIdRequest = {
  company_branch_id: string;
};
export type GetAllByCompanyBranchIdResponse = {
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
  attendance_submission: {
    attendance_submission_id: number;
    reason: string;
    attendance: {
      attendance_check: {
        type: $Enums.AttendanceCheckType;
        time: string;
        status: $Enums.AttendanceCheckStatus;
      }[];
      date: Date;
    } | null;
  } | null;
};

export type ValidateRequest = {
  submission_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
};
