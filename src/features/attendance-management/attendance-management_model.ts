type AttendanceCheckType = string; // Ganti dengan tipe data yang sesuai untuk `AttendanceCheckType`
type AttendanceCheckStatus = string; // Ganti dengan tipe data yang sesuai untuk `AttendanceCheckStatus`

type AttendanceCheck = {
  type: AttendanceCheckType;
  time: string;

  status: AttendanceCheckStatus;
  employee_file: {
    file_url: string;
  };
};

export type GetAttendanceResponse = {
  attendance_id: number;
  date: Date;
  attendance_check: AttendanceCheck[];
  assign_shift: {
    shift: {
      name: string;
    };
  };
  employee: {
    first_name: string;
    last_name: string;
  };
};

export type UpdateAttendanceRequest = {
  attendance_check_id: number;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
};
export type GetAttendanceRequest = {
  company_branch_id: string;
  name: string;
};
