import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import {
  AddShiftRequest,
  AddShiftResponse,
  GetShiftRequest,
  GetShiftResponse,
  DeleteShiftRequest,
  DeleteShiftResponse,
  AddAssignShiftRequest,
  AddAssignShiftResponse,
  UpdateAssignShiftRequest,
  UpdateAssignShiftResponse,
  GetAllAsignShiftResponse,
  GetAllAsignShiftRequest,
} from "./shift-model";
import { ShiftValidation } from "./shift-validation";

export class ShiftService {
  static async addShift({
    company_branch_id,
    name,
    start_time,
    end_time,
  }: AddShiftRequest): Promise<AddShiftResponse> {
    const request = Validation.validate(ShiftValidation.ADD_SHIFT, {
      name,
      start_time,
      end_time,
    });
    const shift = await prisma.shift.create({
      data: {
        start_time: request.start_time,
        end_time: request.end_time,
        name: request.name,
        company_branch: {
          connect: {
            company_branch_id,
          },
        },
      },
    });
    return shift;
  }
  static async deleteShift({
    shift_id,
  }: DeleteShiftRequest): Promise<DeleteShiftResponse> {
    const request = Validation.validate(ShiftValidation.DELETE_SHIFT, {
      shift_id,
    });
    const shift = await prisma.shift.delete({
      where: {
        shift_id: request.shift_id,
      },
    });
    return shift;
  }
  static async getAllShifts({
    company_branch_id,
  }: GetShiftRequest): Promise<GetShiftResponse[]> {
    const shift = await prisma.shift.findMany({
      where: {
        company_branch_id,
      },
    });
    if (!shift) {
      throw new ErrorResponse("Shift not found", 404, ["employee_id"]);
    }
    return shift;
  }
  static async addAssignShift({
    shift_id,
    employee_id,
    company_branch_id,
  }: AddAssignShiftRequest): Promise<AddAssignShiftResponse> {
    const request = Validation.validate(ShiftValidation.ADD_ASSIGN_SHIFT, {
      shift_id,
      employee_id,
    });
    const employee = await prisma.assignShift.findFirst({
      where: {
        employee_id: request.employee_id,
      },
    });
    if (employee) {
      throw new ErrorResponse("Employee already assigned", 400, [
        "employee_id",
      ]);
    }
    const assignShift = await prisma.assignShift.create({
      data: {
        company_branch_id,
        employee_id: request.employee_id,
        shift_id: request.shift_id,
      },
    });
    return assignShift;
  }
  static async updateAssignShift({
    employee_id,
    shift_id,
    company_branch_id,
  }: UpdateAssignShiftRequest): Promise<UpdateAssignShiftResponse> {
    const request = Validation.validate(ShiftValidation.UPDATE_ASSIGN_SHIFT, {
      employee_id,
      shift_id,
    });
    const employee = await prisma.assignShift.findFirst({
      where: {
        employee_id: request.employee_id,
      },
    });
    if (!employee) {
      throw new ErrorResponse("Employee not found", 404, ["employee_id"]);
    }
    const assignShift = await prisma.assignShift.create({
      data: {
        company_branch_id,
        employee_id: request.employee_id,
        shift_id: request.shift_id,
      },
    });
    return assignShift;
  }
  static async getAllAsignShifts({
    company_branch_id,
  }: GetAllAsignShiftRequest) {
    const assignShifts = await prisma.assignShift.findMany({
      orderBy: [{ assign_shift_id: "desc" }],
      where: {
        company_branch_id,
      }, // Urutkan berdasarkan employee_id secara descending, kemudian berdasarkan id secara descending
      distinct: ["employee_id"],
      select: {
        assign_shift_id: true,
        shift: {
          select: {
            name: true,
            start_time: true,
            end_time: true,
          },
        },
        employee: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return assignShifts;
  }
}
