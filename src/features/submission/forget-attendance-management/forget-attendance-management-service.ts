import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./forget-attendance-management-model";
import { ForgetAttendanceManagementValidation } from "./forget-attendance-management-validation";

export class ForgetAttendanceManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string
  ): Promise<GetAllByCompanyBranchIdResponse[]> {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const forgetAttendance = await prisma.submission.findMany({
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },
        type: "SURAT",
      },
      select: {
        employee: {
          select: {
            first_name: true,
            last_name: true,
            employee_id: true,
          },
        },
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
    return forgetAttendance;
  }
  static async getById(submission_id: number): Promise<GetByIdResponse> {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_BY_ID,
      {
        submission_id,
      }
    );
    const forgetAttendance = await prisma.submission.findUnique({
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
        employee: {
          select: {
            employee_id: true,
            last_name: true,
            first_name: true,
          },
        },
        attendance_submission: {
          select: {
            reason: true,
            attendance_submission_id: true,
            attendance: {
              select: {
                date: true,
                attendance_check: {
                  select: {
                    type: true,
                    time: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!forgetAttendance) {
      throw new ErrorResponse("Forget attendance not found", 404, [
        "submission_id",
      ]);
    }
    return forgetAttendance;
  }
  static async validateLetter({ status, submission_id }: ValidateRequest) {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.VALIDATE,
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
            employee_id: true,
            company_branch_id: true,
            assign_shift: {
              orderBy: {
                assign_shift_id: "desc",
              },
              take: 1,
              select: {
                assign_shift_id: true,
              },
            },
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Forget Attendance not found`, 404, [
        "submission_id",
      ]);
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
        await prisma.attendance.create({
          data: {
            date: new Date().toISOString(),
            employee_id: letter?.employee?.employee_id,
            company_branch_id: letter?.employee?.company_branch_id,
            assign_shift_id: letter?.employee?.assign_shift[0].assign_shift_id,
          },
        });
      }
    });
  }
  static async deleteLetter(submission_id: number) {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_BY_ID,
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
      throw new ErrorResponse(`Forget Attendance not found`, 404, [
        "submission_id",
      ]);
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
