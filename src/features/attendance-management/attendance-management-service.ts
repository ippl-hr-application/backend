import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import { AttendanceManagementValidation } from "./attendance-management-validation";
import {
  GetAttendanceRequest,
  GetAttendanceResponse,
  UpdateAttendanceRequest,
} from "./attendance-management_model";

export class AttendanceManagementService {
  static async getAllAttendances({
    company_branch_id,
    name,
  }: GetAttendanceRequest): Promise<GetAttendanceResponse[]> {
    const attendances = await prisma.attendance.findMany({
      where: {
        company_branch_id,

        employee: {
          OR: [
            { first_name: { contains: name || "", mode: "insensitive" } }, // Mencari nama pertama yang mengandung 'name' atau kosong jika 'name' kosong
            { last_name: { contains: name || "", mode: "insensitive" } }, // Mencari nama terakhir yang mengandung 'name' atau kosong jika 'name' kosong
          ],
        },
      },
      select: {
        attendance_id: true,
        date: true,
        attendance_check: {
          select: {
            status: true,

            time: true,
            type: true,
            employee_file: {
              select: {
                file_url: true,
              },
            },
          },
        },

        employee: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        assign_shift: {
          select: {
            shift: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        attendance_id: "desc",
      },
    });

    return attendances;
  }
  static async getAttendanceById(
    attendance_id: number
  ): Promise<GetAttendanceResponse> {
    const request = Validation.validate(
      AttendanceManagementValidation.GET_ATTENDANCE,
      { attendance_id }
    );
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendance_id: request.attendance_id,
      },
      select: {
        attendance_id: true,
        date: true,
        assign_shift: {
          select: {
            shift: {
              select: {
                name: true,
              },
            },
          },
        },
        employee: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        attendance_check: {
          select: {
            status: true,

            time: true,
            type: true,
            employee_file: {
              select: {
                file_url: true,
              },
            },
          },
        },
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, ["attendance_id"]);
    }
    return attendance;
  }
  static async updateAttendance({
    attendance_check_id,
    status,
  }: UpdateAttendanceRequest) {
    const request = Validation.validate(
      AttendanceManagementValidation.UPDATE_ATTENDANCE,
      { attendance_check_id, status }
    );
    const attendance = await prisma.attendanceCheck.findUnique({
      where: {
        attendance_check_id: request.attendance_check_id,
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, [
        "attendance_check_id",
      ]);
    }
    const updatedAttendance = await prisma.attendanceCheck.update({
      where: {
        attendance_check_id: request.attendance_check_id,
      },
      data: {
        status: request.status,
      },
    });
    return updatedAttendance;
  }
  static async deleteAttendance(attendance_id: number) {
    const request = Validation.validate(
      AttendanceManagementValidation.DELETE_ATTENDANCE,
      { attendance_id }
    );
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendance_id: request.attendance_id,
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, ["attendance_id"]);
    }
    const deletedAttendance = await prisma.attendance.delete({
      where: {
        attendance_id: request.attendance_id,
      },
    });
    return deletedAttendance;
  }
}
