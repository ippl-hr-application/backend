import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import {
  AddScheduleRequest,
  AddScheduleResponse,
  DeleteScheduleRequest,
  DeleteScheduleResponse,
  GetDetailScheduleRequest,
  GetDetailScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
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
  static async updateSchedule({
    schedule_id,
    title,
    description,
    date,
  }: UpdateScheduleRequest): Promise<UpdateScheduleResponse> {
    const schedule = await prisma.schedule.update({
      where: {
        schedule_id,
      },
      data: {
        title,
        description,
        date,
      },
    });
    return schedule;
  }
  static async getDetailSchedule({
    schedule_id,
  }: GetDetailScheduleRequest): Promise<GetDetailScheduleResponse> {
    const schedule = await prisma.schedule.findUnique({
      where: {
        schedule_id,
      },
    });
    if (!schedule) {
      throw new ErrorResponse("Schedule not found", 404, ["schedule_id"]);
    }
    return schedule;
  }
}
