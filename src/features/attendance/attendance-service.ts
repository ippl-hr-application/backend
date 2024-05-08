import { date } from "zod";
import { prisma } from "../../applications";
import {
  AttendanceCheckRequest,
  AttendanceCheckResponse,
  AttendanceRecapRequest,
  AttendanceRecapResponse,
  AttendanceTodayResponse,
  DetailAttendanceRecap,
  GetShiftInfoRequest,
  GetShiftInfoResponse,
} from "./attendance-model";
import { Validation } from "../../validations";
import { AttendanceValidation } from "./attendance_validation";
import { pathToFileUrl } from "../../utils/format";

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
                company_branch_id: true,
                city: true,
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
      company_branch_id: shiftInfo?.employee.company_branch.company_branch_id,
      city: shiftInfo?.employee.company_branch.city,
    };
  }
  static async attendanceCheck({
    employee_id,
    assign_shift_id,
    type,
    long,
    lat,
    attendance_file,
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
        assign_shift_id,
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
                file_name: attendance_file?.originalname || "",
                file_size: attendance_file?.size || 0,
                file_type: attendance_file?.mimetype || "",
                file_url: pathToFileUrl(
                  attendance_file?.path || "",
                  process.env.SERVER_URL || "http://localhost:3000"
                ),
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
    const shiftInfo = await prisma.assignShift.findFirst({
      where: {
        assign_shift_id,
      },
      select: {
        shift: {
          select: {
            start_time: true,
            end_time: true,
          },
        },
      },
    });
    return {
      date: new Date(),
      from: shiftInfo?.shift.start_time,
      to: shiftInfo?.shift.end_time,
      time: date.substring(11, 19),
    };
  }
  static async getToday(employee_id: string): Promise<AttendanceTodayResponse> {
    const today = new Date().toISOString().split("T")[0];
    const attendance = await prisma.attendance.findFirst({
      where: {
        employee_id,
        date: today,
      },
      select: {
        attendance_id: true,
        date: true,
        attendance_check: {
          select: {
            time: true,
            type: true,
            status: true,
          },
        },
        assign_shift: {
          select: {
            shift: {
              select: {
                start_time: true,
                end_time: true,
              },
            },
          },
        },
      },
    });
    return {
      attendance_id: attendance?.attendance_id,
      date: today,
      from: attendance?.assign_shift?.shift?.start_time,
      to: attendance?.assign_shift?.shift?.end_time,
      checks: attendance?.attendance_check?.map(
        (check: { time: any; type: any; status: any }) => {
          return {
            time: check.time,
            type: check.type,
            status: check.status,
          };
        }
      ),
    };
  }

  static async getRecap({
    employee_id,
    month_and_year,
  }: AttendanceRecapRequest): Promise<AttendanceRecapResponse> {
    const request = Validation.validate(AttendanceValidation.GET_RECAP, {
      month_and_year,
    });
    const attendances = await prisma.attendance.findMany({
      where: {
        employee_id,
        date: {
          gte: `${request.month_and_year}-01`,
          lte: `${request.month_and_year}-31`,
        },
      },
      select: {
        attendance_id: true,
        date: true,
        attendance_check: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            status: true,
          },
        },
      },
    });

    const attendanceArray: DetailAttendanceRecap[] = [];
    attendances.forEach((attendance) => {
      let isPresent = false;
      if (
        attendance.attendance_check &&
        attendance.attendance_check.length >= 2
      ) {
        isPresent = true;
      }
      attendanceArray.push({
        attendance_id: attendance.attendance_id,
        date: attendance.date.toISOString(),
        isPresent: isPresent,
      });
    });

    return {
      detail: attendanceArray,
      number_of_absences: attendanceArray.filter(
        (attendance) => !attendance.isPresent
      ).length,
      number_of_attendees: attendanceArray.filter(
        (attendance) => attendance.isPresent
      ).length,
    };
  }
}
