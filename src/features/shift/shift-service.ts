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
      company_branch_id,
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
            company_branch_id: request.company_branch_id,
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
}
