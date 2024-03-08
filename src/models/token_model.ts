import { JwtPayload } from "jsonwebtoken";

export interface UserToken extends JwtPayload {
  user_id: string;
}

export interface EmployeeToken extends JwtPayload {
  unique_id: string;
}

