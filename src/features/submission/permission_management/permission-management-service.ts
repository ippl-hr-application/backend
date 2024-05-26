import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./permission-management-model";
import { PermissionManagementValidation } from "./permission-management-validation";

export class PermissionManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<GetAllByCompanyBranchIdResponse> {
    const request = Validation.validate(
      PermissionManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const permission = await prisma.submission.findMany({
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },
        type: "IZIN",
        submission_date: {
          gte: start_date,
          lte: end_date,
        },
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
        status: true,
        employee: {
          select: {
            first_name: true,
            last_name: true,
            employee_id: true,
          },
        },
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    return {
      permission_data: permission,
      num_not_validated: permission.filter(
        (permission) => permission.status === "PENDING"
      ).length,
    };
  }
  static async getById(
    submission_id: number,
    company_branch_id: string
  ): Promise<GetByIdResponse> {
    const request = Validation.validate(
      PermissionManagementValidation.GET_BY_ID,
      {
        submission_id,
        company_branch_id,
      }
    );
    const permission = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
        status: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
        employee: {
          select: {
            first_name: true,
            last_name: true,
            employee_id: true,
          },
        },
        permission_submission: {
          select: {
            permission_reason: true,
            from: true,
            to: true,
            type: true,
          },
        },
      },
    });
    if (!permission) {
      throw new ErrorResponse("Permission not found", 404, ["submission_id"]);
    }
    return permission;
  }
  static async validateLetter({
    status,
    submission_id,
    company_branch_id,
  }: ValidateRequest) {
    const request = Validation.validate(
      PermissionManagementValidation.VALIDATE,
      {
        submission_id,
        status,
        company_branch_id,
      }
    );
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Permission not found`, 404, ["submission_id"]);
    }
    await prisma.submission.update({
      where: {
        submission_id: request.submission_id,
      },
      data: {
        status: request.status,
      },
    });
  }
  static async deleteLetter(submission_id: number, company_branch_id: string) {
    const request = Validation.validate(
      PermissionManagementValidation.GET_BY_ID,
      {
        submission_id,
        company_branch_id,
      }
    );
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
      select: {
        type: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Permission not found`, 404, ["submission_id"]);
    }
    if (letter.employee_file) {
      await deleteFile(letter.employee_file.file_url);
    }
    await prisma.submission.delete({
      where: {
        submission_id: request.submission_id,
      },
    });
  }
}
