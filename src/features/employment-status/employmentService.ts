import { Validation } from '../../validations';
import { AccountValidation } from './employmentValidation';
import { comparePassword, hashPassword } from '../../utils';
import {
  GetEmploymentStatusRequest,
  GetEmploymentStatusResponse,
} from './employmentModel';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';
import { boolean } from 'zod';

export class EmploymentStatusService {
  static async getEmploymentStatus(
    request: GetEmploymentStatusRequest
  ): Promise<GetEmploymentStatusResponse> {
    const employmentStatus = await prisma.employmentStatus.findMany({
      where: { company_branch_id: request.company_branch_id },
    });

    return employmentStatus;
  }
}