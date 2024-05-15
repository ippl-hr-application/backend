import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./mutasi-management-model";
import { MutasiManagementValidation } from "./mutasi-management-validation";

export class MutasiManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string
  ): Promise<GetAllByCompanyBranchIdResponse[]> {
    const request = Validation.validate(
      MutasiManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const mutasi = await prisma.submission.findMany({
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },
        type: "MUTASI",
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    return mutasi;
  }
  static async getById(submission_id: number): Promise<GetByIdResponse> {
    const request = Validation.validate(MutasiManagementValidation.GET_BY_ID, {
      submission_id,
    });
    const mutasi = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
        mutation_submission: {
          select: {
            mutation_reason: true,
            current_company_branch: {
              select: {
                company_branch_id: true,
                city: true,
              },
            },
            target_company_branch: {
              select: {
                company_branch_id: true,
                city: true,
              },
            },
          },
        },
      },
    });
    if (!mutasi) {
      throw new ErrorResponse("Mutasi not found", 404, ["submission_id"]);
    }
    return mutasi;
  }
  static async validateLetter({ status, submission_id }: ValidateRequest) {
    const request = Validation.validate(MutasiManagementValidation.VALIDATE, {
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
      throw new ErrorResponse(`Mutasi not found`, 404, ["submission_id"]);
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
        await prisma.employee.update({
          where: {
            employee_id: letter.employee.employee_id,
          },
          data: {
            company_branch_id: letter.employee.company_branch_id,
          },
        });
      }
    });
  }
  static async deleteLetter(submission_id: number) {
    const request = Validation.validate(MutasiManagementValidation.GET_BY_ID, {
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
      throw new ErrorResponse(`Mutasi not found`, 404, ["submission_id"]);
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
