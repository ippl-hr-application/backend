import { date } from "zod";
import { prisma } from "../../applications";
import {
  AttendanceCheckRequest,
  AttendanceCheckResponse,
  GetShiftInfoRequest,
  GetShiftInfoResponse,
} from "./attendance-model";

export class AttendanceService {
  static async getShiftInfo({
    employee_id,
  }: GetShiftInfoRequest): Promise<GetShiftInfoResponse> {
    const shiftInfo = await prisma.shift.findFirst({
      where: {
        employee_id,
      },
      select: {
        shift_id: true,
        start_time: true,
        end_time: true,
        employee: {
          select: {
            first_name: true,
            last_name: true,
            company_branch: {
              select: {
                company: {
                  select: {
                    name: true,
                    company_logo: {
                      select: {
                        file_url: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!shiftInfo) {
      throw new Error("Attendance not found");
    }
    return {
      company_name: shiftInfo?.employee.company_branch.company.name,
      employee_name: `${shiftInfo?.employee.first_name} ${shiftInfo?.employee.last_name}`,
      logo_url:
        shiftInfo?.employee.company_branch.company.company_logo?.file_url,
      date: new Date(),
      from: shiftInfo?.start_time,
      to: shiftInfo?.end_time,
    };
  }
  static async attendanceCheck({
    employee_id,
    shift_id,
    type,
    long,
    lat,
    attendance_file,
  }: AttendanceCheckRequest): Promise<AttendanceCheckResponse> {
    const date = new Date().toISOString();
    await prisma.attendance.create({
      data: {
        date: date,
        shift_id,
        employee_id,
        attendance_check: {
          create: {
            type,
            long,
            lat,
            status: "PENDING",
            time: date.substring(11, 19),
            employee_file: {
              create: {
                file_name: attendance_file?.originalname || "",
                file_size: attendance_file?.size || 0,
                file_type: attendance_file?.mimetype || "",
                file_url: `/uploads/attendance_file/${attendance_file?.filename}`,
                file_for: "kehadiran karyawan",
                employee: {
                  connect: {
                    employee_id,
                  },
                },
              },
            },
          },
        },
      },
    });
    const shiftInfo = await prisma.shift.findFirst({
      where: {
        shift_id,
      },
    });
    return {
      date: new Date(),
      from: shiftInfo?.start_time,
      to: shiftInfo?.end_time,
      time: date.substring(11, 19),
    };
  }
}
