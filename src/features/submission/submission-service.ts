import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
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
} from "./submission-model";
import { SubmissionValidation } from "./submission-validation";
import { pathToFileUrl } from "../../utils/format";

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
      employee_id,
    });
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
      employee_id,
    });

    await prisma.submission.create({
      data: {
        status: "PENDING",
        submission_date: new Date(),
        type: "mutasi",
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
  }: GetSubmissionHistoryRequest): Promise<GetSubmissionHistoryResponse[]> {
    let submission: GetSubmissionHistoryResponse[] = [];

    const whereConditions: any = {
      employee_id,
    };

    if (year) {
      whereConditions.submission_date = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    }

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
    const submission = await prisma.submission.findUnique({
      where: {
        submission_id,
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
}
