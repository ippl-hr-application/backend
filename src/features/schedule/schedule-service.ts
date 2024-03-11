import { prisma } from "../../applications";
import {
  AddScheduleRequest,
  AddScheduleResponse,
  DeleteScheduleRequest,
  DeleteScheduleResponse,
} from "./schedule-model";

export class ScheduleService {
  static async addSchedule({
    title,
    description,
    date,
    unique_id,
  }: AddScheduleRequest): Promise<AddScheduleResponse> {
    const employee = await prisma.employee.findUnique({
      where: { unique_id },
      select: {
        employee_id: true,
      },
    });
    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        date,
        employee: {
          connect: {
            employee_id: employee?.employee_id,
          },
        },
      },
    });
    return schedule;
  }
  static async deleteSchedule({
    schedule_id,
  }: DeleteScheduleRequest): Promise<DeleteScheduleResponse> {
    const schedule = await prisma.schedule.delete({
      where: {
        schedule_id,
      },
    });
    return schedule;
  }
}
