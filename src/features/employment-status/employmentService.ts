import { Validation } from '../../validations';
import { EmploymentStatusValidation } from './employmentValidation';
import {
  GetEmploymentStatusRequest,
  GetEmploymentStatusResponse,
  CreateEmploymentStatusRequest,
  CreateEmploymentStatusResponse,
  UpdateEmploymentStatusRequest,
  UpdateEmploymentStatusResponse,
  DeleteEmploymentStatusRequest,
  DeleteEmploymentStatusResponse,
} from './employmentModel';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';

export class EmploymentStatusService {
  static async getEmploymentStatus({
    company_branch_id,
  }: GetEmploymentStatusRequest): Promise<GetEmploymentStatusResponse> {
    const employmentStatus = await prisma.employmentStatus.findMany({
      where: {
        company_branch_id: company_branch_id,
      },
    });

    return employmentStatus;
  }

  static async createEmploymentStatus({
    company_id,
    company_branch_id,
    name,
  }: CreateEmploymentStatusRequest): Promise<CreateEmploymentStatusResponse> {
    const validatedRequest = Validation.validate(
      EmploymentStatusValidation.CREATE_EMPLOYMENT_STATUS,
      {
        company_branch_id,
        name,
      }
    );
    console.log(company_id, company_branch_id)
    const companyBranch = await prisma.companyBranches.findFirst({
      where: {
        company_branch_id: validatedRequest.company_branch_id,
        company_id: company_id,
      },
    });

    if (!companyBranch) {
      throw new ErrorResponse("Company Branch not found", 404, [
        "company_branch_id",
      ]);
    }   

    const employmentStatus = await prisma.employmentStatus.create({
      data: {
        company_branch_id: validatedRequest.company_branch_id,
        name: validatedRequest.name,
      },
    });

    return employmentStatus;
  }

  static async updateEmploymentStatus({
    company_branch_id,
    employment_status_id,
    name,
  }: UpdateEmploymentStatusRequest): Promise<UpdateEmploymentStatusResponse> {
    const validatedRequest = Validation.validate(
      EmploymentStatusValidation.UPDATE_EMPLOYMENT_STATUS,
      {
        company_branch_id,
        employment_status_id,
        name,
      }
    );

    const isEmploymentStatusExist = await prisma.employmentStatus.findFirst({
      where: {
        employment_status_id: validatedRequest.employment_status_id,
        company_branch_id: validatedRequest.company_branch_id,
      },
    });

    if (!isEmploymentStatusExist) {
      throw new ErrorResponse('Employment Status not found', 404, [
        'employment_status_id',
        'company_branch_id',
      ]);
    }

    const employmentStatus = await prisma.employmentStatus.update({
      where: {
        employment_status_id: validatedRequest.employment_status_id,
        company_branch_id: validatedRequest.company_branch_id,
      },
      data: {
        name: validatedRequest.name,
      },
    });

    return employmentStatus;
  }

  static async deleteEmploymentStatus({
    company_branch_id,
    employment_status_id,
  }: DeleteEmploymentStatusRequest): Promise<DeleteEmploymentStatusResponse> {
    const employmentStatus = await prisma.employmentStatus.delete({
      where: {
        employment_status_id: employment_status_id,
        company_branch_id: company_branch_id,
      },
    });

    return employmentStatus;
  }
}
