import fs from "fs";
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

export class SubmissionService {
  static async createSickLetter({
    from,
    to,
    permission_reason,
    type,
    employee_id,
    file_name,
    file_size,
    file_type,
    file_url,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.SICK_LETTER, {
      permission_reason,
      type,
      from,
      to,
      file_name,
      file_size,
      file_type,
      file_url,
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
            file_name: request.file_name,
            file_size: request.file_size,
            file_type: request.file_type,
            file_url: request.file_url,
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
    file_name,
    file_size,
    file_type,
    file_url,
  }: LeaveSubmissionRequest): Promise<LeaveSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.LEAVE_LETTER, {
      from,
      to,
      leave_reason,
      leave_type,
      employee_id,
      file_name,
      file_size,
      file_type,
      file_url,
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
            file_name: request.file_name,
            file_size: request.file_size,
            file_type: request.file_type,
            file_url: request.file_url,
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
    file_name,
    file_size,
    file_type,
    file_url,
  }: MutationSubmissionRequest): Promise<MutationSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.MUTATION_LETTER, {
      mutation_reason,
      current_company_branch_id,
      target_company_branch_id,
      employee_id,
      file_name,
      file_size,
      file_type,
      file_url,
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
            file_name: request.file_name,
            file_size: request.file_size,
            file_type: request.file_type,
            file_url: request.file_url,
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
    employee_id,
  }: ChangeShiftSubmissionRequest): Promise<ChangeShiftSubmissionResponse> {
    await prisma.submission.create({
      data: {
        employee_id,
        status: "PENDING",
        submission_date: new Date(),
        type: "PERUBAHAN SHIFT",
        change_shift_submission: {
          create: {
            target_shift_id: target_shift_id,
            current_shift_id: current_shift_id,
            target_date: target_date,
          },
        },
      },
    });
    return {
      employee_id,
      target_shift_id: target_shift_id,
      current_shift_id: current_shift_id,
      target_date: target_date,
    };
  }
  static async getSubmissionHistory({
    employee_id,
    year,
    status,
  }: GetSubmissionHistoryRequest): Promise<GetSubmissionHistoryResponse[]> {
    const submission = await prisma.submission.findMany({
      where: {
        employee_id,
        submission_date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
        status,
      },
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
