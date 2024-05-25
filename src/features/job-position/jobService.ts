import { Validation } from "../../validations";
import { JobPositionValidation } from "./jobValidation";
import {
  GetJobPositionRequest,
  GetJobPositionResponse,
  CreateJobPositionRequest,
  CreateJobPositionResponse,
  UpdateJobPositionRequest,
  UpdateJobPositionResponse,
  DeleteJobPositionRequest,
  DeleteJobPositionResponse,
} from "./jobModel";
import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";

export class JobPositionService {
  static async getJobPosition(
    request: GetJobPositionRequest
  ): Promise<GetJobPositionResponse> {
    const jobPosition = await prisma.jobPosition.findMany({
      where: { company_branch_id: request.company_branch_id },
    });

    return jobPosition;
  }

  static async createJobPosition(
    request: CreateJobPositionRequest
  ): Promise<CreateJobPositionResponse> {
    const validatedRequest = Validation.validate(
      JobPositionValidation.CREATE_JOB_POSITION,
      request
    );

    const jobPosition = await prisma.jobPosition.create({
      data: {
        company_branch_id: validatedRequest.company_branch_id,
        name: validatedRequest.name},
    });

    return jobPosition;
  }

  static async updateJobPosition(
    request: UpdateJobPositionRequest
  ): Promise<UpdateJobPositionResponse> {
    const validatedRequest = Validation.validate(
      JobPositionValidation.UPDATE_JOB_POSITION,
      request
    );
    const isJobPositionExist = await prisma.jobPosition.findFirst({
      where: {
        job_position_id: validatedRequest.job_position_id,
        company_branch_id: validatedRequest.company_branch_id,
      },
    });

    if (!isJobPositionExist) {
      throw new ErrorResponse(
        'Job Position not found',
        404,
        ['job_position_id', 'company_branch_id'],
        'JOB_POSITION_NOT_FOUND'
      );
    }

    const jobPosition = await prisma.jobPosition.update({
      where: { 
        job_position_id: validatedRequest.job_position_id,
        company_branch_id: validatedRequest.company_branch_id, 
      },
      data: {
        name: validatedRequest.name,
      },
    });

    return jobPosition;
  }

  static async deleteJobPosition({
    job_position_id, company_branch_id
  }: DeleteJobPositionRequest): Promise<DeleteJobPositionResponse> {
    const jobPosition = await prisma.jobPosition.delete({
      where: {
        job_position_id: job_position_id,
        company_branch_id: company_branch_id,
      },
    });

    return jobPosition;
  }
}