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
    date_and_time,
    permission_reason,
    type,
    employee_id,
    permission_file,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.SICK_LETTER, {
      permission_reason,
      type,
    });

    const permissionSubmission = await prisma.permissionSubmission.create({
      data: {
        date_and_time,
        permission_reason: request.permission_reason,
        type: request.type,
        submission: {
          create: {
            status: "PENDING",
            employee_id: employee_id,
            submission_date: new Date(),
            type: type,
          },
        },
        employee_file: {
          create: {
            file_name: permission_file?.originalname || "",
            file_size: permission_file?.size || 0,
            file_type: permission_file?.mimetype || "",
            file_url: `/uploads/permission_file/${permission_file?.filename}`,
            file_for: `pengajuan ${type}`,

            employee: {
              connect: {
                employee_id,
              },
            },
          },
        },
      },
    });
    return permissionSubmission;
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

    const leaveSubmission = await prisma.leaveSubmission.create({
      data: {
        from,
        to,
        leave_reason: request.leave_reason,
        leave_type: request.leave_type,
        submission: {
          create: {
            employee_id,
            status: "PENDING",
            submission_date: new Date(),
            type: leave_type,
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
      },
    });
    return leaveSubmission;
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

    const mutationSubmission = await prisma.mutationSubmission.create({
      data: {
        mutation_reason: request.mutation_reason,
        submission: {
          create: {
            employee_id,
            status: "PENDING",
            submission_date: new Date(),
            type: "mutation",
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
                employee_id,
              },
            },
          },
        },
      },
    });
    return mutationSubmission;
  }
  static async getSubmissionHistory({
    employee_id,
  }: GetSubmissionHistoryRequest): Promise<GetSubmissionHistoryResponse[]> {
    const submission = await prisma.submission.findMany({
      where: {
        employee_id,
      },
      select: {
        submission_date: true,
        status: true,
        type: true,
      },
    });
    return submission;
  }
}
