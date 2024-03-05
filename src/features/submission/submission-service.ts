import { prisma } from "../../applications";
import {
  PermissionSubmissionRequest,
  PermissionSubmissionResponse,
} from "./submission-model";

export class SubmissionService {
  static async createSickLetter({
    date_time,
    permission_reason,
    type,
    employee_id,
    permission_file,
  }: PermissionSubmissionRequest): Promise<PermissionSubmissionResponse> {
    const permissionSubmission = await prisma.permissionSubmission.create({
      data: {
        date_and_time: date_time,
        permission_reason,
        type: type,
        employee_file: {
          create: {
            file_name: permission_file?.originalname || "",
            file_size: permission_file?.size || 0,
            file_type: permission_file?.mimetype || "",
            file_url: `/uploads/permission_file/${permission_file?.filename}`,
            file_for: "pengajuan izin",

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
      date_time: permissionSubmission.date_and_time,
      permission_reason: permissionSubmission.permission_reason,
      type: permissionSubmission.type,
    };
  }
}
