import { Validation } from "../../validations";
import { prisma } from "../../applications";
import { comparePassword, hashPassword } from "../../utils";
import { ErrorResponse } from "../../models";
import { AuthValidation } from "./auth-validation";
import {
  CurrentLoggedInUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisteredUserWithoutPassword,
} from "./models";
import jwt from "jsonwebtoken";

export class AccountService {
  static async findAllEmployees(){
    return await prisma.employee.findMany();
  };

  static async createEmployee(
    employeeData: 
    { 
      firstName: string; 
      lastName: string; 
      email: string 
    }){

    return await prisma.employee.create({
      data: employeeData,
    });
  };

  static async updateEmployee(id: number, employeeData: { firstName: string; lastName: string; email: string }){
    return await prisma.employee.update({
      where: { id },
      data: employeeData,
    });
  };

  static async deleteEmployee(id: number){
    return await prisma.employee.delete({
      where: { id },
    });
  };
}
