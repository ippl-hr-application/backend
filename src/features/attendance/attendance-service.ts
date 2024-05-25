import { date } from "zod";
import { prisma } from "../../applications";
import {
  AttendanceCheckInRequest,
  AttendanceCheckOutRequest,
  AttendanceCheckResponse,
  AttendanceRecapRequest,
  AttendanceRecapResponse,
  AttendanceTodayResponse,
  DetailAttendanceRecap,
  GetHistoryAttendanceRequest,
  GetHistoryAttendanceResponse,
  GetShiftInfoRequest,
  GetShiftInfoResponse,
} from "./attendance-model";
import { Validation } from "../../validations";
import { AttendanceValidation } from "./attendance_validation";
import { pathToFileUrl } from "../../utils/format";
import { ErrorResponse } from "../../models";

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
        assign_shift_id: true,
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
                latitude: true,
                longitute: true,
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
      logo: shiftInfo?.employee.company_branch.company.company_logo?.file_url,
      company_branch_id: shiftInfo?.employee.company_branch.company_branch_id,
      city: shiftInfo?.employee.company_branch.city,
      assign_shift_id: shiftInfo.assign_shift_id,
    };
  }
  static async attendanceCheckIn({
    employee_id,
    assign_shift_id,

    attendance_file,
  }: AttendanceCheckInRequest): Promise<AttendanceCheckResponse> {
    const request = Validation.validate(AttendanceValidation.CHECK_IN, {
      assign_shift_id,
    });
    const date = new Date().toISOString();
    const assign_shift = await prisma.assignShift.findUnique({
      where: {
        assign_shift_id: request.assign_shift_id,
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
    if (!assign_shift) {
      throw new ErrorResponse(
        "Assign shift not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    if (!attendance_file) {
      throw new ErrorResponse(
        "File not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    const employee = await prisma.employee.findUnique({
      where: {
        employee_id,
      },
      select: {
        company_branch_id: true,
      },
    });
    if (!employee) {
      throw new ErrorResponse(
        "Employee not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    await prisma.attendance.create({
      data: {
        date: date,
        assign_shift_id: request.assign_shift_id,
        employee_id,
        company_branch_id: employee?.company_branch_id,
        attendance_check: {
          create: {
            type: "CHECK_IN",
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
    return {
      date: new Date(),
      from: assign_shift.shift.start_time,
      to: assign_shift.shift.end_time,
      time: date.substring(11, 19),
    };
  }
  static async attendanceCheckOut({
    employee_id,
    attendance_id,
    attendance_file,
  }: AttendanceCheckOutRequest): Promise<AttendanceCheckResponse> {
    const request = Validation.validate(AttendanceValidation.CHECK_OUT, {
      attendance_id,
    });
    const date = new Date().toISOString();
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendance_id: request.attendance_id,
      },
      select: {
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
    if (!attendance) {
      throw new ErrorResponse(
        "Attendance not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    if (!attendance_file) {
      throw new ErrorResponse(
        "File not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    const employee = await prisma.employee.findUnique({
      where: {
        employee_id,
      },
      select: {
        company_branch_id: true,
      },
    });
    if (!employee) {
      throw new ErrorResponse(
        "Employee not found",
        404,
        ["NOT_FOUND"],
        "NOT_FOUND"
      );
    }
    await prisma.attendanceCheck.create({
      data: {
        status: "PENDING",
        time: date.substring(11, 19),
        type: "CHECK_OUT",
        attendance: {
          connect: { attendance_id: request.attendance_id },
        },
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
    });
    return {
      date: new Date(),
      from: attendance.assign_shift.shift.start_time,
      to: attendance.assign_shift.shift.end_time,
      time: date.substring(11, 19),
    };
  }
  static async getToday(employee_id: string): Promise<AttendanceTodayResponse> {
    const today = new Date().toISOString();
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
    month,
    year,
  }: AttendanceRecapRequest): Promise<AttendanceRecapResponse> {
    const request = Validation.validate(AttendanceValidation.GET_RECAP, {
      month,
      year,
    });

    const attendances = await prisma.attendance.findMany({
      where: {
        employee_id,
        date: {
          gte: `${request.year}-${request.month}-01T00:00:00Z`,
          lte: `${
            request.month === "12"
              ? `${Number(request.year) + 1}-01`
              : `${request.year}-${(Number(request.month) + 1)
                  .toString()
                  .padStart(2, "0")}`
          }-01T00:00:00Z`,
        },
      },
      select: {
        attendance_id: true,
        date: true,
        attendance_check: true,
      },
    });

    const attendanceArray: DetailAttendanceRecap[] = [];
    attendances.forEach((attendance) => {
      let isPresent = false;
      if (
        attendance.attendance_check &&
        attendance.attendance_check.length >= 2 &&
        attendance.attendance_check[0].status === "ACCEPTED" &&
        attendance.attendance_check[1].status === "ACCEPTED"
      ) {
        isPresent = true;
      }
      attendanceArray.push({
        attendance_id: attendance.attendance_id,
        date: attendance.date,
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
  static async getHistoryAttendance({
    employee_id,
    date,
  }: GetHistoryAttendanceRequest): Promise<GetHistoryAttendanceResponse> {
    const request = Validation.validate(AttendanceValidation.GET_HISTORY, {
      date,
    });
    const attendance = await prisma.attendance.findFirst({
      where: {
        date: request.date,
        employee_id,
      },
      select: {
        attendance_id: true,
        date: true,
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
        attendance_check: {
          select: {
            time: true,
          },
        },
      },
    });
    if (!attendance) {
      throw new ErrorResponse("Attendance not found", 404, ["NOT_FOUND"]);
    }
    return {
      attendance_id: attendance.attendance_id,
      date: attendance.date,
      start_time: attendance.assign_shift?.shift?.start_time,
      end_time: attendance.assign_shift?.shift?.end_time,
      check_in_time: attendance.attendance_check[0]?.time,
      check_out_time: attendance.attendance_check[1]?.time,
    };
  }
}
