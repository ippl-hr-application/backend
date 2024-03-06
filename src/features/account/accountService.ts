import { Validation } from '../../validations';
import { AccountValidation } from './accountValidation';
import {
  CreateRequest,
  CreateResponse,
  UpdateRequest,
  UpdateResponse,
  DeleteRequest,
  DeleteResponse,
} from './accountModel';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';

export class AccountService {
  static async getAllEmployees(company_branch_id: number) {
    return await prisma.employee.findMany({
      where: { company_branch_id: company_branch_id },
    });
  }

  static async createEmployee(employeeData: CreateRequest) : Promise<CreateResponse> {
    const request = Validation.validate(
      AccountValidation.CREATE_EMPLOYEE,
      employeeData
    );

    const countEmployee = await prisma.employee.count({
      where: { email: request.email },
    });

    if (countEmployee > 0) {
      throw new ErrorResponse(
        'Email already exists',
        400,
        ['email'],
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const newEmployee = await prisma.employee.create({
      data: {
        employee_id: request.employee_id,
        company_branch_id: request.company_branch_id,
        job_position_id: request.job_position_id,
        employment_status_id: request.employment_status_id,
        unique_id: request.unique_id,
        first_name: request.first_name,
        last_name: request.last_name,
        email: request.email,
        password: request.password,
        phone_number: request.phone_number,
        place_of_birth: request.place_of_birth,
        birth_date: request.date_of_birth,
        marital_status: request.marital_status,
        blood_type: request.blood_type,
        religion: request.religion,
        identity_type: request.identity_type,
        identity_number: request.identity_number,
        identity_expired_date: request.identity_expired_date,
        postcal_code: request.postcal_code,
        citizen_id_address: request.citizen_id_address,
        residential_address: request.residential_address,
        bank_account_number: request.bank_account_number,
        bank_type: request.bank_type,
        wage: request.wage,
      },
    });

    return newEmployee;
  }

  static async updateEmployee(employeeData: UpdateRequest) : Promise<UpdateResponse> {
    const request = Validation.validate(
      AccountValidation.UPDATE_EMPLOYEE,
      employeeData
    );

    const findEmployee = await prisma.employee.findUnique({
      where: {
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id,
       },
    });

    if (!findEmployee) {
      throw new ErrorResponse(
        'Employee not found',
        404,
        ['employee_id'],
        'EMPLOYEE_NOT_FOUND'
      );
    }

    const employeeUpdate = await prisma.employee.update({
      where: { 
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id
      },
      data: employeeData,
    });

    return  employeeUpdate ;
  }

  static async deleteEmployee(employeeId: DeleteRequest) : Promise<DeleteResponse> {
    const request = Validation.validate(
      AccountValidation.DELETE_EMPLOYEE,
      employeeId
    );

    const findEmployee = await prisma.employee.findUnique({
      where : { 
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id 
      },
    });

    if (!findEmployee) {
      throw new ErrorResponse(
        'Employee not found',
        404,
        ['employee_id'],
        'EMPLOYEE_NOT_FOUND'
      );
    }

    const employeeDelete = await prisma.employee.delete({
      where: { 
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id
      },
    });

    return employeeDelete;
  }
}
