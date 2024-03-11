import { prisma } from "../../applications";
import { GetShiftInfoRequest, GetShiftInfoResponse } from "./attendance-model";

export class AttendanceService {
  static async getShiftInfo({
    employee_id,
  }: GetShiftInfoRequest): Promise<GetShiftInfoResponse> {
    const shiftInfo = await prisma.shift.findFirst({
      where: {
        employee_id,
      },
      select: {
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
}
