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
import { sendEmail } from '../../utils/nodemailer';

export class AccountService {
  static async getAllEmployees(getEmployeeData: GetEmployeeRequest): Promise<GetAllEmployeeResponse> {
    const findJobPositionId = await prisma.jobPosition.findMany({
      where: {
        name: {contains: getEmployeeData.job_position_name, mode: 'insensitive'},
      },
    });

    const findEmploymentStatusId = await prisma.employmentStatus.findMany({
      where: {
        name: {contains: getEmployeeData.employment_status_name, mode: 'insensitive'},
      },
    });

    if(getEmployeeData.get_all === 'true'){
      const findEmployee = await prisma.employee.findMany({
        where: {
          company_branch_id: getEmployeeData.company_branch_id,
        },
      });

      return findEmployee;
    }

    if(getEmployeeData.deleted === 'true'){
      const findEmployee = await prisma.employee.findMany({
        where: {
          NOT: {delete_at: null},
        },
      });
      return findEmployee;
    }
    
    const findEmployee = await prisma.employee.findMany({
      where: {
        first_name: getEmployeeData.first_name ? { contains: getEmployeeData.first_name, mode: "insensitive" } : undefined,
        last_name: getEmployeeData.last_name ? { contains: getEmployeeData.last_name, mode: "insensitive"} : undefined,
        gender: getEmployeeData.gender,
        company_branch_id: getEmployeeData.company_branch_id,
        hasResigned: getEmployeeData.hasResigned === 'true' ? true : false,
        job_position_id: {in: findJobPositionId.map((jobPosition) => jobPosition.job_position_id)},
        employment_status_id: {in: findEmploymentStatusId.map((employmentStatus) => employmentStatus.employment_status_id)},
      },
    })

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

    return findEmployee;
  }

  static async createAccountEmployeeAndNotifyEmployees(
    employee: {
      employee_id: string,
      company_branch_id: string,
      password: string,
    }
  ) {
    const findEmployee = await AccountService.searchEmployee(employee);
    const findBranchName = await prisma.companyBranches.findUnique({
      where: {
        company_branch_id: findEmployee?.company_branch_id,
      },
      select: {
        hq_initial: true,
      }
    });
    
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #444444;
            }
            p {
                font-size: 1rem;
            }
            .strike-through {
                text-decoration: line-through;
            }
            .credentials {
                background-color: #f9f9f9;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin-top: 20px;
            }
            .credentials p {
                margin: 5px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 0.8rem;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Selamat Datang, ${findEmployee?.first_name} ${findEmployee?.last_name}!</h1>
            <p>Anda telah menjadi <span class="strike-through">budak</span> karyawan baru di perusahaan kami. Kami sangat senang Anda bergabung dengan tim kami. Berikut adalah kredensial Anda:</p>
            
            <div class="credentials">
                <p><strong>Employee ID:</strong> ${employee.employee_id}</p>
                <p><strong>Password:</strong> ${employee.password}</p>
            </div>
    
            <p>Harap simpan informasi ini dengan aman dan jangan bagikan dengan siapa pun.</p>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Perusahaan Kami. Semua hak dilindungi.</p>
            </div>
        </div>
    </body>
    </html>
    `;  

    const mailOptions = {
      from: `Meraih <${process.env.EMAIL}>`, // sender address
      to: findEmployee?.email, // list of receivers
      subject: 'Account Created', // Subject line
      html: htmlTemplate, // html body
    };

    sendEmail(mailOptions);
  }

  static async createEmployee(createData: CreateRequest
  ): Promise<CreateResponse> {
    if(createData.identity_expired_date !== undefined){
      createData.identity_expired_date = new Date(
        createData.identity_expired_date
      );
    }
    if(createData.birth_date !== undefined){
      createData.birth_date = new Date(createData.birth_date);
    }
    if (createData.join_date !== undefined){
      createData.join_date = new Date(createData.join_date);}
    else{
      createData.join_date = new Date();
    }

    const request = Validation.validate(
      AccountValidation.CREATE_EMPLOYEE,
      createData
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
        ...request,
        password: hashedPassword,
      },
    });

    await AccountService.createAccountEmployeeAndNotifyEmployees({
      employee_id: newEmployee.employee_id,
      company_branch_id: newEmployee.company_branch_id,
      password: request.password,
    });

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
    if (employeeData.birth_date !== undefined) {
      employeeData.birth_date = new Date(employeeData.birth_date);
    }
    if (employeeData.join_date !== undefined) {
      employeeData.join_date = new Date(employeeData.join_date);
    }
    if (employeeData.resign_date !== undefined) {
      employeeData.resign_date = new Date(employeeData.resign_date);
    }
    if (employeeData.hasResigned !== undefined && employeeData.hasResigned === 'true') {
      employeeData.resign_date = new Date();
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
      data: { 
        ...request,
        hasResigned: request?.hasResigned === 'true' ? true : false,
       },
    });

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
