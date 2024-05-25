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
    const isJobPositionExist = await prisma.jobPosition.findFirst({
      where:{
        name: {contains: request.name, mode: "insensitive"}
      }
    })

    if(isJobPositionExist){
      throw new ErrorResponse(
        "Job Position already exist",
        400,
        ["name"],
        "JOB_POSITION_ALREADY_EXIST"
      )
    }

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

    if(isJobPositionExist.name == "Owner" || isJobPositionExist.name == "Manager"){
      throw new ErrorResponse(
        'Cannot Update Owner or Manager Job Position',
        400,
        ['name'],
        'CANNOT_UPDATE_OWNER_MANAGER_JOB_POSITION'
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
    const jobPositionName = await prisma.jobPosition.findFirst({
      where:{
        job_position_id: job_position_id,
      }
    })

    if(jobPositionName?.name == "Owner" || jobPositionName?.name == "Manager"){
      throw new ErrorResponse(
        'Cannot Delete Owner or Manager Job Position',
        400,
        ['name'],
        'CANNOT_DELETE_OWNER_MANAGER_JOB_POSITION'
      );
    }

    if (!jobPositionName) {
      throw new ErrorResponse(
        'Job Position not found',
        404,
        ['job_position_id'],
        'JOB_POSITION_NOT_FOUND'
      );
    }

    const countEmployee = await prisma.employee.count({
      where: {job_position_id: job_position_id}
    })

    if(countEmployee > 0){
      throw new ErrorResponse(
        'Cannot delete job position because there are employees assigned to this job position',
        400,
        ['job_position_id'],
        'CANNOT_DELETE_JOB_POSITION'
      );
    }


    const jobPosition = await prisma.jobPosition.delete({
      where: {
        job_position_id: job_position_id,
        company_branch_id: company_branch_id,
      },
    });

    return jobPosition;
  }
}