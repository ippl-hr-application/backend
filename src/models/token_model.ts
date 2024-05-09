import { JwtPayload } from "jsonwebtoken";

export interface UserToken extends JwtPayload {
  user_id: string;
  company_id: string;
  package_type: string;
}

export interface EmployeeToken extends JwtPayload {
  employee_id: string,
  company_branch_id: string,
  company_id: string,
  position: string,
}

