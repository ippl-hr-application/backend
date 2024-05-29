import { PackageType } from "@prisma/client";
import { prisma } from "../../applications";
import { UpdateUserPackageTypeRequets } from "./meraih-model";
import { Validation } from "../../validations";
import { MeraihValidation } from "./meraih-validation";
import { comparePassword, hashPassword } from "../../utils";
import { ErrorResponse } from "../../models";
import jwt from "jsonwebtoken";

export class MeraihService {
  static async getAllRegisteredUsers() {
    const users = await prisma.registeredUser.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        company: {
          select: {
            company_id: true,
            name: true,
            industry: true,
            npwp_digit: true,
            package_type: true,
            package_end: true,
            company_branches: {
              select: {
                company_branch_id: true,
                email: true,
                phone_number: true,
                address: true,
                province: true,
                city: true,
                size: true,
                hq_code: true,
                hq_initial: true,
                umr: true,
                umr_city: true,
                umr_province: true,
                bpjs: true,
                _count: {
                  select: {
                    employees: true,
                  },
                },
              },
            },
          },
        },
        // include: {
        //   company: {
        //     include: {
        //       company_branches: {
        //         include: {
        //           _count: {
        //             select: {
        //               employees: true,
        //             }
        //           }
        //         }
        //       },
        //     },
        //   },
      },
    });

    return users;
  }

  static async updateCompanyPackageType(data: UpdateUserPackageTypeRequets) {
    const { company_id, package_end, package_type } = Validation.validate(MeraihValidation.UPDATE_COMPANY_PACKAGE_TYPE, {
      ...data,
      package_end: data.package_end ? data.package_end : undefined,
      package_type: data.package_type.toUpperCase() as PackageType,
    });

    await prisma.company.update({
      where: {
        company_id,
      },
      data: {
        package_type: PackageType[package_type],
        package_end: package_end ? new Date(package_end) : null,
      },
    });
  }

  static async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await prisma.meraihUser.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ErrorResponse("User not found", 404, ["email"], "USER_NOT_FOUND");
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      throw new ErrorResponse("Password is incorrect", 400, ["password"], "PASSWORD_INCORRECT");
    }

    const signToken = (data: any) => {
      return jwt.sign(data, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
    };

    return signToken({ user_id: user.user_id, email: user.email });
  }
}
