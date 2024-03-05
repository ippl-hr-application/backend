import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
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
      date_and_time,
      permission_reason,
      type,
      employee_id,
      permission_file,
    });
    const permissionSubmission = await prisma.permissionSubmission.create({
      data: {
        date_and_time: request.date_and_time,
        permission_reason: request.permission_reason,
        type: request.type,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: request.permission_file?.originalname || "",
            file_size: request.permission_file?.size || 0,
            file_type: request.permission_file?.mimetype || "",
            file_url: `/uploads/permission_file/${request.permission_file?.filename}`,
            file_for: "pengajuan izin",

            employee: {
              connect: {
                employee_id: request.employee_id,
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
      from,
      to,
      leave_reason,
      leave_type,
      employee_id,
      leave_file,
    });
    const leaveSubmission = await prisma.leaveSubmission.create({
      data: {
        from: request.from,
        to: request.to,
        leave_reason: request.leave_reason,
        leave_type: request.leave_type,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: request.leave_file?.originalname || "",
            file_size: request.leave_file?.size || 0,
            file_type: request.leave_file?.mimetype || "",
            file_url: `/uploads/leave_file/${request.leave_file?.filename}`,
            file_for: "pengajuan cuti",
            employee: {
              connect: {
                employee_id: request.employee_id,
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
      mutation_file,
    });
    const mutationSubmission = await prisma.mutationSubmission.create({
      data: {
        mutation_reason: request.mutation_reason,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: request.mutation_file?.originalname || "",
            file_size: request.mutation_file?.size || 0,
            file_type: request.mutation_file?.mimetype || "",
            file_url: `/uploads/mutation_file/${request.mutation_file?.filename}`,
            file_for: "pengajuan mutasi",
            employee: {
              connect: {
                employee_id: request.employee_id,
              },
            },
          },
        },
      },
    });
    return mutationSubmission;
  }
}
