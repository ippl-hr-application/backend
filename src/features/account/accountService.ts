import { Validation } from "../../validations";
import { AccountValidation } from "./accountValidation";
import {
    CreateRequest,
    CreateResponse,
    UpdateRequest,
    UpdateResponse,
    DeleteRequest,
    DeleteResponse,
  } from "./models";
import { prisma } from "../../applications";
import { ErrorResponse } from "../../models"

export class AccountService {
  static async getAllEmployees(){
    return await prisma.employee.findMany();
  };

  static async createEmployee(
    employeeData: CreateRequest
    ){
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
