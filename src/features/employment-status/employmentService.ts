import { Validation } from '../../validations';
import { EmploymentStatusValidation } from './employmentValidation';
import {
  GetEmploymentStatusRequest,
  GetEmploymentStatusResponse,
  CreateEmploymentStatusRequest,
  CreateEmploymentStatusResponse,
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

    const employmentStatus = await prisma.employmentStatus.create({
      data: {
        company_branch_id: validatedRequest.company_branch_id,
        name: validatedRequest.name,
      },
    });

    return employmentStatus;
  }
}
