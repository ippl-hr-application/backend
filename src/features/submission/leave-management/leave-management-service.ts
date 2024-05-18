import { start } from "repl";
import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./leave-management-model";
import { LeaveManagementValidation } from "./leave-management-validation";
import { deleteFile } from "../../../utils/delete_file";

export class LeaveManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string
  ): Promise<GetAllByCompanyBranchIdResponse[]> {
    const request = Validation.validate(
      LeaveManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const leave = await prisma.leaveSubmission.findMany({
      where: {
        submission: {
          employee: {
            company_branch_id: request.company_branch_id,
          },
        },
      },
      select: {
        submission: {
          select: {
            submission_id: true,
            submission_date: true,
            type: true,
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
        },
      },
    });
    const leaveMapped = leave.map((l) => {
      return {
        submission_id: l.submission.submission_id,
        submission_date: l.submission.submission_date,
        type: l.submission.type,
        employee: {
          first_name: l.submission.employee.first_name,
          last_name: l.submission.employee.last_name,
          employee_id: l.submission.employee.employee_id,
        },
        employee_file: {
          file_url: l.submission.employee_file?.file_url,
        },
      };
    });
    return leaveMapped;
  }
  static async getById(submission_id: number): Promise<GetByIdResponse> {
    const request = Validation.validate(LeaveManagementValidation.GET_BY_ID, {
      submission_id,
    });
    const leave = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
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
        leave_submission: {
          select: {
            from: true,
            to: true,
            leave_reason: true,
            leave_permission_id: true,
          },
        },
      },
    });
    if (!leave) {
      throw new ErrorResponse("Leave not found", 404, ["submission_id"]);
    }
    return leave;
  }
  static async validateLetter({ status, submission_id }: ValidateRequest) {
    const request = Validation.validate(LeaveManagementValidation.VALIDATE, {
      submission_id,
      status,
    });
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Leave not found`, 404, ["submission_id"]);
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
  static async deleteLetter(submission_id: number) {
    const request = Validation.validate(LeaveManagementValidation.GET_BY_ID, {
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
      throw new ErrorResponse(`Leave not found`, 404, ["submission_id"]);
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
