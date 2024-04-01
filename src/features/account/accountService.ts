import { Validation } from '../../validations';
import { AccountValidation } from './accountValidation';
import { comparePassword, hashPassword } from '../../utils';
import {
  CreateRequest,
  CreateResponse,
  UpdateRequest,
  UpdateResponse,
  DeleteRequest,
  DeleteResponse,
  GetEmployeeRequest,
  ResignRequest,
} from './accountModel';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';

export class AccountService {
  static async getAllEmployees(company_branch_id: string, hasResigned: string) {
    console.log(hasResigned);
    return await prisma.employee.findMany({
      where: {
        company_branch_id: company_branch_id,
        hasResigned: hasResigned === 'true' ? true : false,
      },
    });
  }

  static async searchEmployee({
    company_branch_id,
    employee_id,
  }: GetEmployeeRequest) {
    const findEmployee = await prisma.employee.findUnique({
      where: {
        company_branch_id: company_branch_id,
        employee_id: employee_id,
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

    return findEmployee;
  }

  static async createEmployee(
    employeeData: CreateRequest
  ): Promise<CreateResponse> {
    employeeData.identity_expired_date = new Date(
      employeeData.identity_expired_date
    );
    employeeData.birth_date = new Date(employeeData.birth_date);

    const request = Validation.validate(
      AccountValidation.CREATE_EMPLOYEE,
      employeeData
    );

    const countEmailEmployee = await prisma.employee.count({
      where: { email: request.email },
    });

    if (countEmailEmployee > 0) {
      throw new ErrorResponse(
        'Email already exists',
        400,
        ['email'],
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const hashedPassword = hashPassword(request.password);

    const newEmployee = await prisma.employee.create({
      data: {
        company_branch_id: request.company_branch_id,
        job_position_id: request.job_position_id,
        employment_status_id: request.employment_status_id,
        first_name: request.first_name,
        last_name: request.last_name,
        email: request.email,
        password: hashedPassword,
        phone_number: request.phone_number,
        place_of_birth: request.place_of_birth,
        birth_date: request.birth_date,
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
        // gender: request.gender,
      },
    });

    return {
      first_name: request.first_name,
      last_name: request.last_name,
    };
  }

  static async updateEmployee(
    employeeData: UpdateRequest
  ): Promise<UpdateResponse> {
    if (employeeData.identity_expired_date) {
      employeeData.identity_expired_date = new Date(
        employeeData.identity_expired_date
      );
    }

    const request = Validation.validate(
      AccountValidation.UPDATE_EMPLOYEE,
      employeeData
    );

    const findEmployee = await prisma.employee.findUnique({
      where: {
        company_branch_id: request.company_branch_id, // pake user local?
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
        company_branch_id: request.company_branch_id, // pake user local?
        employee_id: request.employee_id,
      },
      data: { ...request },
    });

    return employeeUpdate;
  }

  static async deleteEmployee(data: DeleteRequest): Promise<DeleteResponse> {
    const request = Validation.validate(
      AccountValidation.DELETE_EMPLOYEE,
      data
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

    const employeeDelete = await prisma.employee.delete({
      where: {
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id,
      },
    });

    return employeeDelete;
  }

  // static async softDeleteEmployee({
  //   employee_id,
  //   company_branch_id,
  // }: DeleteRequest) {
  //   const deleteDate = new Date();
  //   const findEmployee = await prisma.employee.findUnique({
  //     where: {
  //       company_branch_id,
  //       employee_id,
  //     },
  //   });

  //   if (!findEmployee) {
  //     throw new ErrorResponse(
  //       "Employee not found",
  //       404,
  //       ["employee_id"],
  //       "EMPLOYEE_NOT_FOUND"
  //     );
  //   }

  //   const employeeDelete = await prisma.employee.update({
  //     where: {
  //       company_branch_id,
  //       employee_id,
  //     },
  //     data: {
  //       delete_at: deleteDate,
  //     },
  //   });

  //   return employeeDelete;
  // }

  static async employeeResign({
    employee_id,
    company_branch_id,
  }: ResignRequest) {
    const findEmployee = await prisma.employee.findUnique({
      where: {
        company_branch_id,
        employee_id,
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

    const employeeResign = await prisma.employee.update({
      where: {
        company_branch_id,
        employee_id,
      },
      data: {
        hasResigned: true,
      },
    });

    return employeeResign;
  }

  // static async getEmployeesByResignedStatus({
  //   company_branch_id,
  //   hasResigned,
  // }: ResignStatusRequest) {
  //   console.log(hasResigned);
  //   const employees = await prisma.employee.findMany({
  //     where: {
  //       company_branch_id: company_branch_id,
  //       hasResigned: hasResigned,
  //     },
  //   });
  //   return employees;
  // }
}
