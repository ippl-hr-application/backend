import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { Validation } from "../../../validations";
import { AccountService } from "../../account/accountService";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./resign-management-model";
import { ResignManagementValidation } from "./resign-management-validation";

export class ResignManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string
  ): Promise<GetAllByCompanyBranchIdResponse[]> {
    const request = Validation.validate(
      ResignManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const resign = await prisma.submission.findMany({
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },
        type: "RESIGN",
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
    return resign;
  }
  static async getById(
    submission_id: number,
    company_branch_id: string
  ): Promise<GetByIdResponse> {
    const request = Validation.validate(ResignManagementValidation.GET_BY_ID, {
      submission_id,
      company_branch_id,
    });
    const resign = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
      select: {
        submission_id: true,
        submission_date: true,
        status: true,
        type: true,
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
        resign_submission: {
          select: {
            resign_submission_id: true,
            reason: true,
          },
        },
      },
    });
    if (!resign) {
      throw new ErrorResponse("Resign not found", 404, ["submission_id"]);
    }
    return resign;
  }
  static async validateLetter({ status, submission_id }: ValidateRequest) {
    const request = Validation.validate(ResignManagementValidation.VALIDATE, {
      submission_id,
      status,
    });
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        employee: {
          select: {
            employee_id: true,
            company_branch_id: true,
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse("Resign not found", 404, ["submission_id"]);
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.submission.update({
        where: {
          submission_id: request.submission_id,
        },
        data: {
          status: request.status,
        },
      });
      if (request.status === "ACCEPTED") {
        await AccountService.employeeResign({
          company_branch_id: letter.employee.company_branch_id,
          employee_id: letter.employee.employee_id,
        });
      }
    });
  }
  static async deleteLetter(submission_id: number) {
    const request = Validation.validate(ResignManagementValidation.GET_BY_ID, {
      submission_id,
    });
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
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
      throw new ErrorResponse(`Resign not found`, 404, ["submission_id"]);
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
