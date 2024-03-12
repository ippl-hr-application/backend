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
  static async getEmploymentStatus(
    request: GetEmploymentStatusRequest
  ): Promise<GetEmploymentStatusResponse> {
    const employmentStatus = await prisma.employmentStatus.findMany({
      where: { 
        company_branch_id: request.company_branch_id 
      },
    });

    return employmentStatus;
  }

  static async createEmploymentStatus(
    request: CreateEmploymentStatusRequest
  ): Promise<CreateEmploymentStatusResponse> {

    const validatedRequest = Validation.validate(
      EmploymentStatusValidation.CREATE_EMPLOYMENT_STATUS,
      request
    );

    const employmentStatus = await prisma.employmentStatus.create({
      data: validatedRequest,
    });

    return employmentStatus;
  }
}