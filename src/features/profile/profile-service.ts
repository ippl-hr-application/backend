import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import {
  EmployeeProfileRequest,
  EmployeeProfileResponse,
} from "./profiel-model";

export class ProfileService {
  static async getProfile({
    unique_id,
  }: EmployeeProfileRequest): Promise<EmployeeProfileResponse> {
    const profile = await prisma.employee.findUnique({
      where: {
        unique_id,
      },
      select: {
        employee_id: true,
        first_name: true,
        last_name: true,
        email: true,
        residential_address: true,
        phone_number: true,
        job_position: {
          select: {
            name: true,
          },
        },
        employment_status: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!profile) {
      throw new ErrorResponse(
        "Profile not found",
        404,
        ["unique_id"],
        "PROFILE_NOT_FOUND"
      );
    }
    return profile;
  }
}
