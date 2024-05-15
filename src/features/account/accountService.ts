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
  GetAllEmployeeResponse,
} from './accountModel';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';

export class AccountService {
  static async getAllEmployees({
    company_branch_id, 
    hasResigned, 
    first_name,
    last_name, 
    gender,
    job_position_name,
    employment_status_name,
    get_all,
    deleted,
  }: GetEmployeeRequest): Promise<GetAllEmployeeResponse> {
    const findJobPositionId = await prisma.jobPosition.findMany({
      where: {
        name: {contains: job_position_name, mode: 'insensitive'},
      },
    });

    const findEmploymentStatusId = await prisma.employmentStatus.findMany({
      where: {
        name: {contains: employment_status_name, mode: 'insensitive'},
      },
    });

    if(get_all === 'true'){
      const findEmployee = await prisma.employee.findMany({
        where: {
          company_branch_id: company_branch_id,
        },
      });

      if(findEmployee[0] == undefined){
        throw new ErrorResponse(
          'Employee not found',
          404,
          ['employee'],
          'EMPLOYEE_NOT_FOUND'
        );
      }
      return findEmployee;
    }

    if(deleted === 'true'){
      const findEmployee = await prisma.employee.findMany({
        where: {
          NOT: {delete_at: null},
        },
      });
      if(findEmployee[0] == undefined){
        throw new ErrorResponse(
          'Employee not found',
          404,
          ['employee'],
          'EMPLOYEE_NOT_FOUND'
        );
      }
      return findEmployee;
    }
    
    const findEmployee = await prisma.employee.findMany({
      where: {
        first_name: first_name ? { contains: first_name, mode: "insensitive" } : undefined,
        last_name: last_name ? { contains: last_name, mode: "insensitive"} : undefined,
        gender: gender,
        company_branch_id: company_branch_id,
        hasResigned: hasResigned === 'true' ? true : false,
        job_position_id: {in: findJobPositionId.map((jobPosition) => jobPosition.job_position_id)},
        employment_status_id: {in: findEmploymentStatusId.map((employmentStatus) => employmentStatus.employment_status_id)},
      },
    })

    if(findEmployee[0] == undefined){
      throw new ErrorResponse(
        'Employee not found',
        404,
        ['employee'],
        'EMPLOYEE_NOT_FOUND'
      );
    }
    return findEmployee;
  }

  static async searchEmployee({
    company_branch_id,
    employee_id,
  }: {company_branch_id: string, employee_id: string}) {
    const findEmployee = await prisma.employee.findUnique({
      where: {
        delete_at: null,
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
    {
      company_branch_id,
      job_position_id,
      employment_status_id,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      place_of_birth,
      birth_date,       
      marital_status,
      blood_type,
      religion,
      identity_type,
      identity_number,
      identity_expired_date,       
      postcal_code,
      citizen_id_address,
      residential_address,
      bank_account_number,
      bank_type,
      wage,
      gender,
      join_date
    }: CreateRequest
  ): Promise<CreateResponse> {
    if(identity_expired_date !== undefined){
      identity_expired_date = new Date(
        identity_expired_date
      );
    }
    if(birth_date !== undefined){
      birth_date = new Date(birth_date);
    }
    if (join_date !== undefined){
      join_date = new Date(join_date);}
    else{
      join_date = new Date();
    }

    const request = Validation.validate(
      AccountValidation.CREATE_EMPLOYEE,
      { 
        company_branch_id,
        job_position_id,
        employment_status_id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        place_of_birth,
        birth_date,       
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expired_date,       
        postcal_code,
        citizen_id_address,
        residential_address,
        bank_account_number,
        bank_type,
        wage,
        gender,
        join_date
      }
    );

    const countEmailEmployee = await prisma.employee.count({
      where: { 
        company_branch_id: request.company_branch_id, 
        email: request.email,
        delete_at: null
      },
    });

    if (countEmailEmployee > 0) {
      throw new ErrorResponse(
        'Email already exists',
        400,
        ['email'],
        'EMAIL_ALREADY_EXISTS'
      );
    }

    const job_position = await prisma.jobPosition.findUnique({
      where: {
        job_position_id: request.job_position_id,
        company_branch_id: request.company_branch_id,
      },
    });

    if (!job_position) {
      throw new ErrorResponse(
        'Job position not found',
        404,
        ['job_position_id'],
        'JOB_POSITION_NOT_FOUND'
      );
    }

    const employment_status = await prisma.employmentStatus.findUnique({
      where: {
        employment_status_id: request.employment_status_id,
        company_branch_id: request.company_branch_id,
      },
    });

    if (!employment_status) {
      throw new ErrorResponse(
        'Employment status not found',
        404,
        ['employment_status_id'],
        'EMPLOYMENT_STATUS_NOT_FOUND'
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
        gender: request.gender,
        join_date: request.join_date,
      },
    });
    console.log(newEmployee)
    return {
      employee_id: newEmployee.employee_id,
      first_name: request.first_name,
      last_name: request.last_name,
    };
  }

  static async updateEmployee(
    employeeData: UpdateRequest
  ): Promise<UpdateResponse> {
    if (employeeData.identity_expired_date !== undefined) {
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
        employee_id: request.employee_id,
      },
      data: { ...request },
    });
    console.log(employeeUpdate)
    return {
      employee_id: employeeUpdate.employee_id,
      first_name: employeeUpdate.first_name,
      last_name: employeeUpdate.last_name,
    };
  }

  static async softDeleteEmployee(data: DeleteRequest): Promise<DeleteResponse> {
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
    } else if (findEmployee.delete_at !== null) {
      throw new ErrorResponse(
        'Employee already deleted',
        400,
        ['employee_id'],
        'EMPLOYEE_ALREADY_DELETED'
      );
    }

    const employeeDelete = await prisma.employee.update({
      where: {
        company_branch_id: request.company_branch_id,
        employee_id: request.employee_id,
      },
      data: {
        hasResigned: true,
        delete_at: new Date(),
      },
    });

    return {
      employee_id: employeeDelete.employee_id,
      first_name: employeeDelete.first_name,
      last_name: employeeDelete.last_name,
    };
  }

  static async deleteEmployeeFromDatabase(data: DeleteRequest): Promise<DeleteResponse> {
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

    return {
      employee_id: employeeDelete.employee_id,
      first_name: employeeDelete.first_name,
      last_name: employeeDelete.last_name,
    };
  }
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

    var status_resign = findEmployee.hasResigned;
    var resign_date = findEmployee.resign_date;

    if(status_resign === false){
      status_resign = true;
    } else {
      status_resign = false;
    }

    if(resign_date === null){
      resign_date = new Date();
    } else {
      resign_date = null;
    }

    const employeeResign = await prisma.employee.update({
      where: {
        company_branch_id,
        employee_id,
      },
      data: {
        hasResigned: status_resign,
        resign_date: resign_date,
      },
    });

    return {
      employee_id: employeeResign.employee_id,
      first_name: employeeResign.first_name,
      last_name: employeeResign.last_name,
      hasResigned: employeeResign.hasResigned,
    };
  }
}
