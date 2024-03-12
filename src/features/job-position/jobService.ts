import { Validation } from "../../validations";
import { JobPositionValidation } from "./jobValidation";
import {
  GetJobPositionRequest,
  GetJobPositionResponse,
  CreateJobPositionRequest,
  CreateJobPositionResponse,
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
}