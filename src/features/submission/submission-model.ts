import { string } from "zod";

type PermissionType = "SAKIT" | "IZIN";
export type PermissionSubmissionRequest = {
  date_and_time: Date;
  permission_reason: string;
  type: PermissionType;
  employee_id: string;
  permission_file: Express.Multer.File | undefined;
};

export type PermissionSubmissionResponse = {
  date_and_time: Date;
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
  employee_id: string;
  mutation_file: Express.Multer.File | undefined;
};

export type MutationSubmissionResponse = {
  mutation_reason: string;
};
