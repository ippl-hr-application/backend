import { string } from "zod";

type PermissionType = "SAKIT" | "IZIN";
export type PermissionSubmissionRequest = {
  date_time: Date;
  permission_reason: string;
  type: PermissionType;
  employee_id: string;
  permission_file: Express.Multer.File | undefined;
};

export type PermissionSubmissionResponse = {
  date_time: Date;
  permission_reason: string;
  type: PermissionType;
};
