import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import {
  AddShiftRequest,
  AddShiftResponse,
  DeleteShiftRequest,
  DeleteShiftResponse,
  GetAllShiftRequest,
  GetAllShiftResponse,
  GetShiftEmployeeRequest,
  GetShiftEmployeeResponse,
  UpdateShiftRequest,
  UpdateShiftResponse,
} from "./shift-model";

export class ShiftService {
  static async addShift({
    employee_id,
    start_time,
    end_time,
  }: AddShiftRequest): Promise<AddShiftResponse> {
    const shift = await prisma.shift.create({
      data: {
        start_time,
        end_time,
        employee: {
          connect: {
            employee_id: employee_id,
          },
        },
      },
    });
    return shift;
  }
  static async deleteShift({
    shift_id,
  }: DeleteShiftRequest): Promise<DeleteShiftResponse> {
    const shift = await prisma.shift.delete({
      where: {
        shift_id,
      },
    });
    return shift;
  }
  static async updateShift({
    shift_id,
    employee_id,
    start_time,
    end_time,
  }: UpdateShiftRequest): Promise<UpdateShiftResponse> {
    const shift = await prisma.shift.update({
      where: {
        shift_id,
      },
      data: {
        start_time,
        end_time,
        employee: {
          connect: {
            employee_id,
          },
        },
      },
    });
    return shift;
  }
  static async getShiftEmployee({
    employee_id,
  }: GetShiftEmployeeRequest): Promise<GetShiftEmployeeResponse> {
    const shift = await prisma.shift.findFirst({
      where: {
        employee_id,
      },
    });
    if (!shift) {
      throw new ErrorResponse("Shift not found", 404, ["employee_id"]);
    }
    return shift;
  }
  static async getAllShifts({
    company_branch_id,
  }: GetAllShiftRequest): Promise<GetAllShiftResponse> {
    const shifts = await prisma.shift.findMany({
      where: {
        employee: {
          company_branch_id,
        },
      },
    });
    return shifts;
  }
}
