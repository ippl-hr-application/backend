import { Employee, EmploymentStatus, JobPosition } from "@prisma/client";

export type EmployeeProfileResponse = Pick<
  Employee,
  | "employee_id"
  | "first_name"
  | "last_name"
  | "email"
  | "residential_address"
  | "phone_number"
> & {
  job_position: {
    name: string;
  };
  employment_status: {
    name: string;
  };
};

export type EmployeeProfileRequest = {
  unique_id: string;
};
