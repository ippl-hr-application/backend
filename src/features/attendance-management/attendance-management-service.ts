import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import {
  GetAttendanceResponse,
  UpdateAttendanceRequest,
} from "./attendance-management.model";

export class AttendanceManagementService {
  static async getAllAttendances(
    company_branch_id: string
  ): Promise<GetAttendanceResponse[]> {
    const attendances = await prisma.attendance.findMany({
      where: {
        company_branch_id,
      },
      select: {
        attendance_id: true,
        date: true,
        attendance_check: {
          select: {
            status: true,
            long: true,
            lat: true,
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
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendance_id,
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
            long: true,
            lat: true,
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
    const attendance = await prisma.attendanceCheck.findUnique({
      where: {
        attendance_check_id,
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, [
        "attendance_check_id",
      ]);
    }
    const updatedAttendance = await prisma.attendanceCheck.update({
      where: {
        attendance_check_id,
      },
      data: {
        status,
      },
    });
    return updatedAttendance;
  }
  static async deleteAttendance(attendance_id: number) {
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendance_id,
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, ["attendance_id"]);
    }
    const deletedAttendance = await prisma.attendance.delete({
      where: {
        attendance_id,
      },
    });
    return deletedAttendance;
  }
}
