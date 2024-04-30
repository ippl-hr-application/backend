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
  city: string | null;
};

export type AttendanceCheckRequest = {
  employee_id: string;
  assign_shift_id: number;
  type: "CHECK_IN" | "CHECK_OUT";
  long: number;
  lat: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
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
  check_in: {
    time: string | undefined;
    type: string | undefined;
    status: string | undefined;
  };
};
export type AttendanceRecapRequest = {
  employee_id: string;
  month_and_year: string | undefined;
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
