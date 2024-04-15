import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import {
  CreatePayrollRequest,
  GetPayrollRequest,
  UpdatePayrollRequest,
} from "./payroll-model";
import { PayrollValidation } from "./payroll-validation";

export class PayrollService {
  static async getPayrolls(data: GetPayrollRequest) {
    const { company_branch_id, month, year } = Validation.validate(
      PayrollValidation.GET_PAYROLL,
      data
    );

    const [payrolls, totalWage] = await prisma.$transaction([
      prisma.payroll.findMany({
        where: {
          company_branch_id,
          month,
          year,
        },
        include: {
          employee: {
            select: {
              first_name: true,
              last_name: true,
            }
          },
        },
        orderBy: {
          employee: {
            first_name: "asc",
          },
        },
      }),
      prisma.payroll.aggregate({
        where: {
          company_branch_id,
          month,
          year,
        },
        _sum: {
          wage: true,
        },
      }),
    ]);

    return [payrolls, totalWage._sum.wage];
  }

  static async createPayroll(data: CreatePayrollRequest) {
    const { company_branch_id, month, year } = Validation.validate(
      PayrollValidation.CREATE_PAYROLL,
      data
    );

    const isPayrollExist = await prisma.payroll.findFirst({
      where: {
        company_branch_id,
        month,
        year,
      },
    });

    if (isPayrollExist) {
      throw new ErrorResponse(
        "Payroll for this month already exist",
        400,
        ["month", "year"],
        "PAYROLL_ALREADY_EXIST"
      );
    }

    const employees = await prisma.employee.findMany({
      where: {
        company_branch_id,
      },
    });

    const payrolls = await prisma.payroll.createMany({
      data: employees.map((employee) => ({
        company_branch_id,
        employee_id: employee.employee_id,
        month,
        year,
        wage: employee.wage,
        status: "PENDING",
      })),
    });

    return payrolls;
  }

  static async updatePayroll({ payroll_id, status }: UpdatePayrollRequest) {
    const isPayrollExist = await prisma.payroll.findUnique({
      where: {
        payroll_id: Number(payroll_id),
      },
    });

    if (!isPayrollExist) {
      throw new ErrorResponse(
        "Payroll not found",
        404,
        ["payroll_id"],
        "PAYROLL_NOT_FOUND"
      );
    }

    const payroll = await prisma.payroll.update({
      where: {
        payroll_id: Number(payroll_id),
      },
      data: {
        status,
      },
    });

    return payroll;
  }

  static async deletePayroll(payroll_id: string) {
    const isPayrollExist = await prisma.payroll.findUnique({
      where: {
        payroll_id: Number(payroll_id),
      },
    });

    if (!isPayrollExist) {
      throw new ErrorResponse(
        "Payroll not found",
        404,
        ["payroll_id"],
        "PAYROLL_NOT_FOUND"
      );
    }

    const payroll = await prisma.payroll.delete({
      where: {
        payroll_id: Number(payroll_id),
      },
    });

    return payroll;
  }
}