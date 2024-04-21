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
    const shiftInfo = await prisma.assignShift.findFirst({
      orderBy: [{ assign_shift_id: "desc" }],
      distinct: ["employee_id"],
      where: {
        employee_id,
      },
      select: {
        shift: {
          select: {
            shift_id: true,
            start_time: true,
            end_time: true,
            name: true,
          },
        },
        employee: {
          select: {
            first_name: true,
            last_name: true,
            job_position: {
              select: {
                name: true,
              },
            },
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
      from: shiftInfo?.shift.start_time,
      to: shiftInfo?.shift.end_time,
      shift_id: shiftInfo.shift.shift_id,
      shift_name: shiftInfo?.shift.name,
      job_position: shiftInfo?.employee.job_position.name,
    };
  }
  static async attendanceCheck({
    employee_id,
    shift_id,
    type,
    long,
    lat,
    file_name,
    file_size,
    file_type,
    file_url,
  }: AttendanceCheckRequest): Promise<AttendanceCheckResponse> {
    const date = new Date().toISOString();
    const employee = await prisma.employee.findUnique({
      where: {
        employee_id,
      },
      select: {
        company_branch_id: true,
      },
    });
    if (!employee) {
      throw new Error("Employee not found");
    }
    await prisma.attendance.create({
      data: {
        date: date,
        shift_id,
        employee_id,
        company_branch_id: employee?.company_branch_id,

        attendance_check: {
          create: {
            type,
            long,
            lat,
            status: "PENDING",
            time: date.substring(11, 19),
            employee_file: {
              create: {
                file_name,
                file_size,
                file_type,
                file_url,
                file_for: "BUKTI KEHADIRAN",
                employee: {
                  connect: { employee_id },
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
