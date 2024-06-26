import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
  AttendanceSubmissionRequest,
  AttendanceSubmissionResponse,
  ChangeShiftSubmissionRequest,
  ChangeShiftSubmissionResponse,
  GetSubmissionHistoryRequest,
  GetSubmissionHistoryResponse,
  LeaveSubmissionRequest,
  LeaveSubmissionResponse,
  MutationSubmissionRequest,
  MutationSubmissionResponse,
  PermissionSubmissionRequest,
  PermissionSubmissionResponse,
  ResignSubmissionRequest,
  ResignSubmissionResponse,
} from "./submission-model";
import { SubmissionValidation } from "./submission-validation";
import { pathToFileUrl } from "../../utils/format";
import { ErrorResponse } from "../../models";

export class SubmissionService {
  static async createSickLetter({
    from,
    to,
    permission_reason,
    type,
    employee_id,
    sick_file,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.SICK_LETTER, {
      permission_reason,
      type,
      from,
      to,
    });
    if (!sick_file) {
      throw new ErrorResponse("Sick Letter File is required", 400, [
        "sick_file",
      ]);
    }
    await prisma.submission.create({
      data: {
        submission_date: new Date(),
        status: "PENDING",
        type: request.type,
        permission_submission: {
          create: {
            from: request.from,
            to: request.to,
            permission_reason: request.permission_reason,
            type: request.type,
          },
        },
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
        employee_file: {
          create: {
            file_name: sick_file?.originalname || "",
            file_size: sick_file?.size || 0,
            file_type: sick_file?.mimetype || "",
            file_url: pathToFileUrl(
              sick_file?.path || "",
              process.env.SERVER_URL || "http://localhost:3000"
            ),
            file_for: `SURAT ${request.type}`,
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
      },
    });

    return {
      from: from,
      to: to,
      permission_reason: permission_reason,
      type: type,
    };
  }

  static async createLeaveLetter({
    from,
    to,
    leave_reason,
    leave_type,
    employee_id,
    leave_file,
  }: LeaveSubmissionRequest): Promise<LeaveSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.LEAVE_LETTER, {
      from,
      to,
      leave_reason,
      leave_type,
    });
    if (!leave_file) {
      throw new ErrorResponse("Leave Letter File is required", 400, [
        "leave_file",
      ]);
    }
    await prisma.submission.create({
      data: {
        status: "PENDING",
        submission_date: new Date(),
        type: request.leave_type,
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
        employee_file: {
          create: {
            file_name: leave_file?.originalname || "",
            file_size: leave_file?.size || 0,
            file_type: leave_file?.mimetype || "",
            file_url: pathToFileUrl(
              leave_file?.path || "",
              process.env.SERVER_URL || "http://localhost:3000"
            ),
            file_for: "SURAT CUTI ",
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
        leave_submission: {
          create: {
            from: request.from,
            to: request.to,

            leave_reason: request.leave_reason,
          },
        },
      },
    });
    return {
      from: request.from,
      leave_reason: request.leave_reason,
      leave_type: request.leave_type,
      to: request.to,
    };
  }
  static async createMutationLetter({
    mutation_reason,
    employee_id,
    current_company_branch_id,
    target_company_branch_id,
    mutation_file,
  }: MutationSubmissionRequest): Promise<MutationSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.MUTATION_LETTER, {
      mutation_reason,
      current_company_branch_id,
      target_company_branch_id,
    });
    if (!mutation_file) {
      throw new ErrorResponse("Mutation Letter File is required", 400, [
        "mutation_file",
      ]);
    }
    await prisma.submission.create({
      data: {
        status: "PENDING",
        submission_date: new Date(),
        type: "MUTASI",
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
        mutation_submission: {
          create: {
            mutation_reason: request.mutation_reason,
            current_company_branch_id: request.current_company_branch_id,
            target_company_branch_id: request.target_company_branch_id,
          },
        },
        employee_file: {
          create: {
            file_name: mutation_file?.originalname || "",
            file_size: mutation_file?.size || 0,
            file_type: mutation_file?.mimetype || "",
            file_url: pathToFileUrl(
              mutation_file?.path || "",
              process.env.SERVER_URL || "http://localhost:3000"
            ),
            file_for: "SURAT MUTASI",
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
      },
    });
    return {
      mutation_reason: request.mutation_reason,
    };
  }
  static async createChangeShiftLetter({
    target_shift_id,
    current_shift_id,
    target_date,
    reason,
    employee_id,
  }: ChangeShiftSubmissionRequest): Promise<ChangeShiftSubmissionResponse> {
    const request = Validation.validate(
      SubmissionValidation.CHANGE_SHIFT_LETTER,
      {
        target_shift_id,
        current_shift_id,
        target_date,
        reason,
      }
    );
    await prisma.submission.create({
      data: {
        employee_id,
        status: "PENDING",
        submission_date: new Date(),
        type: "PERUBAHAN SHIFT",
        change_shift_submission: {
          create: {
            reason: request.reason,
            target_shift_id: request.target_shift_id,
            current_shift_id: request.current_shift_id,
            target_date: request.target_date,
          },
        },
      },
    });
    return {
      employee_id,
      reason: request.reason,
      target_shift_id: request.target_shift_id,
      current_shift_id: request.current_shift_id,
      target_date: request.target_date,
    };
  }
  static async getSubmissionHistory({
    employee_id,
    year,
    status,
    month,
  }: GetSubmissionHistoryRequest): Promise<GetSubmissionHistoryResponse[]> {
    const request = Validation.validate(
      SubmissionValidation.GET_SUBMISSION_HISTORY,
      {
        year,
        month,
        status,
      }
    );
    let submission: GetSubmissionHistoryResponse[] = [];
    const whereConditions: any = {
      employee_id,
    };
    whereConditions.submission_date = {
      gte: `${request.year}-${request.month}-01T00:00:00Z`,
      lte: `${
        request.month === "12"
          ? `${Number(request.year) + 1}-01`
          : `${request.year}-${(Number(request.month) + 1)
              .toString()
              .padStart(2, "0")}`
      }-01T00:00:00Z`,
    };

    if (status) {
      whereConditions.status = status;
    }

    submission = await prisma.submission.findMany({
      where: whereConditions,
      select: {
        submission_id: true,
        submission_date: true,
        status: true,
        type: true,
      },
    });

    return submission;
  }
  static async deleteSubmission({
    submission_id,
  }: {
    submission_id: number;
  }): Promise<void> {
    const request = Validation.validate(
      SubmissionValidation.DELETE_SUBMISSION,
      {
        submission_id,
      }
    );
    const submission = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    if (!submission) throw new Error("Submission not found");

    await prisma.submission.delete({
      where: {
        submission_id,
      },
    });
  }
  static async createResignLetter({
    employee_id,
    reason,
    resign_file,
  }: ResignSubmissionRequest): Promise<ResignSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.RESIGN_LETTER, {
      reason,
    });
    if (!resign_file) {
      throw new ErrorResponse("Resign Letter File is required", 400, [
        "resign_file",
      ]);
    }
    await prisma.submission.create({
      data: {
        status: "PENDING",
        submission_date: new Date(),
        type: "RESIGN",
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
        employee_file: {
          create: {
            file_name: resign_file?.originalname || "",
            file_size: resign_file?.size || 0,
            file_type: resign_file?.mimetype || "",
            file_url: pathToFileUrl(
              resign_file?.path || "",
              process.env.SERVER_URL || "http://localhost:3000"
            ),
            file_for: "SURAT RESIGN",
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
        resign_submission: {
          create: {
            reason: request.reason,
          },
        },
      },
    });
    return {
      reason: reason,
      employee_id: employee_id,
    };
  }

  static async createAttendanceLetter({
    attendance_id,
    attendance_submission_file,
    employee_id,
    reason,
  }: AttendanceSubmissionRequest): Promise<AttendanceSubmissionResponse> {
    const request = Validation.validate(
      SubmissionValidation.ATTENDANCE_LETTER,
      {
        reason,
        attendance_id,
      }
    );
    if (!attendance_submission_file) {
      throw new ErrorResponse("File not found", 400, [
        "attendance_submission_file",
      ]);
    }
    await prisma.submission.create({
      data: {
        status: "PENDING",
        submission_date: new Date(),
        type: "SURAT KEHADIRAN",
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
        attendance_submission: {
          create: {
            reason: request.reason,
            attendance_id: request.attendance_id,
          },
        },
        employee_file: {
          create: {
            file_name: attendance_submission_file?.originalname || "",
            file_size: attendance_submission_file?.size || 0,
            file_type: attendance_submission_file?.mimetype || "",
            file_url: pathToFileUrl(
              attendance_submission_file?.path || "",
              process.env.SERVER_URL || "http://localhost:3000"
            ),
            file_for: "SURAT KEHADIRAN",
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
      },
    });
    return {
      reason: reason,
      employee_id: employee_id,
    };
  }
}
