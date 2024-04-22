type PermissionType = "SAKIT" | "IZIN";
type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type PermissionSubmissionRequest = {
  from: Date;
  to: Date;
  permission_reason: string;
  type: PermissionType;
  employee_id: string;
  sick_file: Express.Multer.File | undefined;
};

export type PermissionSubmissionResponse = {
  from: Date;
  to: Date;
  permission_reason: string;
  type: PermissionType;
};

export type LeaveSubmissionRequest = {
  from: Date;
  to: Date;
  leave_reason: string;
  leave_type: string;
  employee_id: string;
  leave_file: Express.Multer.File | undefined;
};

export type LeaveSubmissionResponse = {
  from: Date;
  to: Date;
  leave_reason: string;
  leave_type: string;
};

export type MutationSubmissionRequest = {
  mutation_reason: string;
  current_company_branch_id: string;
  target_company_branch_id: string;
  employee_id: string;
  mutation_file: Express.Multer.File | undefined;
};

export type MutationSubmissionResponse = {
  mutation_reason: string;
};

export type GetSubmissionHistoryRequest = {
  employee_id: string;
  status: SubmissionStatus;
  year: number;
};

export type GetSubmissionHistoryResponse = {
  submission_id: number;
  submission_date: Date;
  type: string;
  status: SubmissionStatus;
};

export type ChangeShiftSubmissionRequest = {
  employee_id: string;
  target_shift_id: number;
  current_shift_id: number;
  target_date: Date;
  reason: string;
};

export type ChangeShiftSubmissionResponse = ChangeShiftSubmissionRequest;

export type ResignSubmissionRequest = {
  employee_id: string;
  resign_file: Express.Multer.File | undefined;
  reason: string;
};

export type ResignSubmissionResponse = {
  reason: string;
  employee_id: string;
};
