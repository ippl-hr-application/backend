import {
  Attendance,
  AttendanceCheckStatus,
  AttendanceCheckType,
} from "@prisma/client";
import { number } from "zod";

export type GetShiftInfoRequest = {
  employee_id: string;
};

type Type = {};
export type GetShiftInfoResponse = {
  employee_name: string;
  company_name: string;
  logo_url: string | undefined;
  date: Date;
  from: string;
  to: string;
  shift_id: number;
  shift_name: string;
  job_position: string;
  company_branch_id: string;
  logo: string | undefined;
  city: string | null;
  assign_shift_id: number;
};

export type AttendanceCheckInRequest = {
  employee_id: string;
  assign_shift_id: number;
  long: number;
  lat: number;
  attendance_file: Express.Multer.File | undefined;
};

export type AttendanceCheckOutRequest = {
  attendance_id: number;
  employee_id: string;
  long: number;
  lat: number;
  attendance_file: Express.Multer.File | undefined;
};
export type AttendanceCheckResponse = {
  date: Date;
  from: string | undefined;
  to: string | undefined;
  time: string;
};

export type AttendanceTodayResponse = {
  attendance_id: number | undefined;
  date: string;
  from: string | undefined;
  to: string | undefined;
  checks:
    | {
        time: string;
        type: AttendanceCheckType;
        status: AttendanceCheckStatus;
      }[]
    | undefined;
};
export type AttendanceRecapRequest = {
  employee_id: string;
  month: string;
  year: string;
};
export type AttendanceRecapResponse = {
  number_of_attendees: number;
  number_of_absences: number;
  detail: DetailAttendanceRecap[];
};

export type DetailAttendanceRecap = {
  attendance_id: number;
  date: string;
  isPresent: false | true;
};
