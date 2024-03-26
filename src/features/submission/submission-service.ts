import fs from "fs";
import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
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
    permission_file,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.SICK_LETTER, {
      permission_reason,
      type,
    });

    if (!permission_file) {
      throw new Error("File is required");
    }
    const permissionSubmission = await prisma.submission.create({
      data: {
        submission_date: new Date(),
        status: "PENDING",
        type: request.type,
        permission_submission: {
          create: {
            from,
            to,
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
            file_name: permission_file?.originalname || "",
            file_size: permission_file?.size || 0,
            file_type: permission_file?.mimetype || "",
            file_url: `/uploads/permission_file/${permission_file?.filename}`,
            file_for: "pengajuan surat izin atau sakit",
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
      from,
      to,
      permission_reason: request.permission_reason,
      type: request.type,
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
      leave_reason,
      leave_type,
      employee_id,
    });

    const leaveSubmission = await prisma.submission.create({
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
            file_url: `/uploads/leave_file/${leave_file?.filename}`,
            file_for: "pengajuan cuti",
            employee: {
              connect: {
                employee_id: employee_id,
              },
            },
          },
        },
        leave_submission: {
          create: {
            from,
            to,
            leave_reason: request.leave_reason,
            leave_type: request.leave_type,
          },
        },
      },
    });
    return {
      from,
      leave_reason,
      leave_type,
      to,
    };
  }
  static async createMutationLetter({
    mutation_reason,
    employee_id,
    mutation_file,
  }: MutationSubmissionRequest): Promise<MutationSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.MUTATION_LETTER, {
      mutation_reason,
      employee_id,
    });

    const mutationSubmission = await prisma.submission.create({
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
          },
        },
        employee_file: {
          create: {
            file_name: mutation_file?.originalname || "",
            file_size: mutation_file?.size || 0,
            file_type: mutation_file?.mimetype || "",
            file_url: `/uploads/mutation_file/${mutation_file?.filename}`,
            file_for: "pengajuan mutasi",
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
  static async getSubmissionHistory({
    employee_id,
  }: GetSubmissionHistoryRequest): Promise<GetSubmissionHistoryResponse[]> {
    const submission = await prisma.submission.findMany({
      where: {
        employee_id,
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

    if (submission.employee_file) {
      const file_path = submission.employee_file.file_url;
      fs.unlink(file_path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log("File deleted successfully");
      });
    }
    await prisma.submission.delete({
      where: {
        submission_id,
      },
    });
  }
}
