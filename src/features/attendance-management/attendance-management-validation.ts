import { ZodType, z } from "zod";

export class AttendanceManagementValidation {
  static readonly GET_ATTENDANCE: ZodType = z.object({
    attendance_id: z.number(),
  });
  static readonly UPDATE_ATTENDANCE: ZodType = z.object({
    attendance_check_id: z.number(),
    status: z.enum(["ACCEPTED", "REJECTED", "PENDING"]),
  });
  static readonly DELETE_ATTENDANCE: ZodType = z.object({
    attendance_id: z.number(),
  });
}
