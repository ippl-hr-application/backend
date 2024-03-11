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
    unique_id,
    permission_file,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.SICK_LETTER, {
      permission_reason,
      type,
    });
    const employee_id = await prisma.employee.findUnique({
      where: {
        unique_id,
      },
      select: {
        employee_id: true,
      },
    });
    const permissionSubmission = await prisma.permissionSubmission.create({
      data: {
        date_and_time,
        permission_reason: request.permission_reason,
        type: request.type,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: permission_file?.originalname || "",
            file_size: permission_file?.size || 0,
            file_type: permission_file?.mimetype || "",
            file_url: `/uploads/permission_file/${permission_file?.filename}`,
            file_for: "pengajuan izin",

            employee: {
              connect: {
                employee_id: employee_id?.employee_id,
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
    unique_id,
    leave_file,
  }: LeaveSubmissionRequest): Promise<LeaveSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.LEAVE_LETTER, {
      leave_reason,
      leave_type,
      unique_id,
    });
    const employee_id = await prisma.employee.findUnique({
      where: {
        unique_id,
      },
      select: {
        employee_id: true,
      },
    });
    const leaveSubmission = await prisma.leaveSubmission.create({
      data: {
        from,
        to,
        leave_reason: request.leave_reason,
        leave_type: request.leave_type,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: leave_file?.originalname || "",
            file_size: leave_file?.size || 0,
            file_type: leave_file?.mimetype || "",
            file_url: `/uploads/leave_file/${leave_file?.filename}`,
            file_for: "pengajuan cuti",
            employee: {
              connect: {
                employee_id: employee_id?.employee_id,
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
    unique_id,
    mutation_file,
  }: MutationSubmissionRequest): Promise<MutationSubmissionResponse> {
    const request = Validation.validate(SubmissionValidation.MUTATION_LETTER, {
      mutation_reason,
      unique_id,
    });
    const employee_id = await prisma.employee.findUnique({
      where: {
        unique_id,
      },
      select: {
        employee_id: true,
      },
    });
    const mutationSubmission = await prisma.mutationSubmission.create({
      data: {
        mutation_reason: request.mutation_reason,
        status: "PENDING",
        employee_file: {
          create: {
            file_name: mutation_file?.originalname || "",
            file_size: mutation_file?.size || 0,
            file_type: mutation_file?.mimetype || "",
            file_url: `/uploads/mutation_file/${mutation_file?.filename}`,
            file_for: "pengajuan mutasi",
            employee: {
              connect: {
                employee_id: employee_id?.employee_id,
              },
            },
          },
        },
      },
    });
    return mutationSubmission;
  }
}
