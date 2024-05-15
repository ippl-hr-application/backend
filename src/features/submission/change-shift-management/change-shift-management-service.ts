import { start } from "repl";
import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./change-shift-management-model";
import { ChangeShiftManagementValidation } from "./change-shift-management-validation";
import { ShiftService } from "../../shift/shift-service";
import { deleteFile } from "../../../utils/delete_file";

export class ChangeShiftManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string
  ): Promise<GetAllByCompanyBranchIdResponse[]> {
    const request = Validation.validate(
      ChangeShiftManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const changeShift = await prisma.submission.findMany({
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },
        type: "PERUBAHAN SHIFT",
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
    return changeShift;
  }
  static async getById(submission_id: number): Promise<GetByIdResponse> {
    const request = Validation.validate(
      ChangeShiftManagementValidation.GET_BY_ID,
      {
        submission_id,
      }
    );
    const changeShift = await prisma.submission.findUnique({
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
        change_shift_submission: {
          select: {
            change_shift_permission_id: true,
            reason: true,
            current_shift: {
              select: {
                name: true,
              },
            },
            target_date: true,
            target_shift: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!changeShift) {
      throw new ErrorResponse("Change shift not found", 404, ["submission_id"]);
    }
    return changeShift;
  }
  static async validateLetter({ status, submission_id }: ValidateRequest) {
    const request = Validation.validate(
      ChangeShiftManagementValidation.VALIDATE,
      {
        submission_id,
        status,
      }
    );
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        employee: {
          select: {
            company_branch_id: true,
            employee_id: true,
          },
        },
        change_shift_submission: {
          select: {
            target_shift_id: true,
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Change shift not found`, 404, ["submission_id"]);
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.submission.update({
        where: {
          submission_id: submission_id,
        },
        data: {
          status: status,
        },
      });
      if (status === "ACCEPTED" && letter.change_shift_submission) {
        await ShiftService.updateAssignShift({
          company_branch_id: letter.employee.company_branch_id,
          employee_id: letter.employee.employee_id,
          shift_id: letter.change_shift_submission?.target_shift_id,
        });
      }
    });
  }
  static async deleteLetter(submission_id: number) {
    const request = Validation.validate(
      ChangeShiftManagementValidation.GET_BY_ID,
      {
        submission_id,
      }
    );
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
      throw new ErrorResponse(`Change shift not found`, 404, ["submission_id"]);
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
