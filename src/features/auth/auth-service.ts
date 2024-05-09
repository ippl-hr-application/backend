import { Validation } from "../../validations";
import { prisma } from "../../applications";
import { comparePassword, hashPassword } from "../../utils";
import { ErrorResponse } from "../../models";
import { AuthValidation } from "./auth-validation";
import {
  CurrentLoggedInUserResponse,
  LoginEmployeeRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisteredUserWithoutPassword,
  CurrentEmployeeLoggedInUserResponse,
} from "./auth-model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../utils/nodemailer";

export class AuthService {
  static async login({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse> {
    const request = Validation.validate(AuthValidation.LOGIN, {
      email,
      password,
    });

    const user = await prisma.registeredUser.findUnique({
      where: { email: request.email },
      select: {
        user_id: true,
        company: {
          select: {
            company_id: true,
            package_type: true,
          },
        },
        password: true,
        role_id: true,
      },
    });

    if (!user) {
      throw new ErrorResponse("Invalid email or password", 400, [
        "email",
        "password",
      ]);
    }

    const isPasswordValid: boolean = comparePassword(
      request.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ErrorResponse("Invalid email or password", 400, [
        "email",
        "password",
      ]);
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        company_id: user.company?.company_id,
        package_type: user.company?.package_type,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
    };
  }

  static async employeeLogin({
    employee_id,
    password,
  }: LoginEmployeeRequest): Promise<LoginResponse> {
    const request = Validation.validate(AuthValidation.EMPLOYEE_LOGIN, {
      employee_id,
      password,
    });

    const employee = await prisma.employee.findFirst({
      where: {
        employee_id: request.employee_id,
      },
      select: {
        employee_id: true,
        company_branch_id: true,
        company_branch: {
          select: {
            company_id: true,
          },
        },
        password: true,
        job_position: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!employee) {
      throw new ErrorResponse("Invalid unique id or password", 400, [
        "unique_id",
        "password",
      ]);
    }

    const isPasswordValid: boolean = comparePassword(
      request.password,
      employee.password
    );

    if (!isPasswordValid) {
      throw new ErrorResponse("Invalid unique id or password", 400, [
        "unique_id",
        "password",
      ]);
    }

    const token = jwt.sign(
      {
        employee_id: employee.employee_id,
        company_branch_id: employee.company_branch_id,
        position: employee.job_position.name,
        company_id: employee.company_branch.company_id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
    };
  }

  static async register(
    data: RegisterRequest
  ): Promise<RegisteredUserWithoutPassword> {
    const request = Validation.validate(AuthValidation.REGISTER, data);

    const countUser = await prisma.registeredUser.count({
      where: { email: request.email },
    });

    if (countUser > 0) {
      throw new ErrorResponse(
        "Email already exists",
        400,
        ["email"],
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const hashedPassword = hashPassword(request.password);

    const user = await prisma.registeredUser.create({
      data: {
        email: request.email,
        full_name: request.full_name,
        phone_number: request.phone_number,
        role_id: 1,
        password: hashedPassword,
        company: {
          create: {
            name: request.company_name,
            industry: request.industry,
            // company_branches: {
            //   create: {
            //     email: request.email,
            //     phone_number: request.phone_number,
            //     hq_initial: "PUSAT",
            //   },
            // },
          },
        },
      },
      include: {
        company: true,
      },
    });

    const companyBranch = await prisma.companyBranches.create({
      data: {
        company_branch_id: user.company!.company_id,
        company_id: user.company!.company_id,
        email: request.email,
        phone_number: request.phone_number,
        hq_initial: "PUSAT",
        job_positions: {
          create: [
            {
              name: "Owner",
            },
            {
              name: "Manager",
            },
            {
              name: "Staff",
            },
          ],
        },
        employment_statuses: {
          create: [
            { name: "Permanent" },
            { name: "Contract" },
            { name: "Probation" },
            { name: "Internship" },
          ],
        },
      },
      include: {
        job_positions: true,
        employment_statuses: true,
      },
    });

    const user_employee_account = await prisma.employee.create({
      data: {
        employee_id: user.user_id,
        company_branch_id: companyBranch.company_branch_id,
        email: request.email,
        password: hashedPassword,
        first_name: (request.full_name as string).split(" ")[0],
        last_name: (request.full_name as string).split(" ")[1] || "",
        phone_number: request.phone_number,
        job_position_id: companyBranch.job_positions.find(
          (job) => job.name === "Owner"
        )!.job_position_id,
        employment_status_id: companyBranch.employment_statuses.find(
          (status) => status.name === "Permanent"
        )!.employment_status_id,
        birth_date: new Date(),
        marital_status: "",
        blood_type: "",
        religion: "",
        citizen_id_address: "",
        gender: "Male",
        identity_expired_date: new Date(),
        identity_number: "",
        identity_type: "",
        join_date: new Date(),
        place_of_birth: "",
        postcal_code: "",
        residential_address: "",
        wage: 0,
      },
    });

    return user;
  }

  static async getCurrentLoggedInUser(
    userId: string,
    employee_id?: string
  ): Promise<
    CurrentLoggedInUserResponse | CurrentEmployeeLoggedInUserResponse
  > {
    if (employee_id) {
      const employee = await prisma.employee.findUnique({
        where: { employee_id: employee_id },
        include: {
          company_branch: true,
          employment_status: true,
          job_position: true,
        },
      });

      if (!employee) {
        throw new ErrorResponse(
          "Employee not found",
          404,
          ["employee_id"],
          "EMPLOYEE_NOT_FOUND"
        );
      }

      return employee;
    }

    const user = await prisma.registeredUser.findUnique({
      where: { user_id: userId },
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
            package_type: true,
            company_branches: {
              select: {
                company_branch_id: true,
                address: true,
                city: true,
                hq_code: true,
                hq_initial: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ErrorResponse(
        "User not found",
        404,
        ["user_id"],
        "USER_NOT_FOUND"
      );
    }

    return user;
  }

  static async resetPassword(token: string, newPassword: string) {
    const request = Validation.validate(AuthValidation.RESET_PASSWORD, {
      token,
      newPassword,
    });

    const resetToken = await prisma.resetPasswordToken.findUnique({
      where: { token: request.token },
    });

    if (!resetToken || resetToken.expired_at < new Date() || resetToken.is_used) {
      throw new ErrorResponse("Token is invalid", 404, ["token"]);
    }

    const user = await prisma.registeredUser.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new ErrorResponse(
        "User not found",
        404,
        ["email"],
        "USER_NOT_FOUND"
      );
    }

    const hashedPassword = hashPassword(request.newPassword);

    await prisma.registeredUser.update({
      where: { email: resetToken.email },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.resetPasswordToken.update({
      where: { token },
      data: {
        is_used: true,
      },
    });
  }

  static async ownerForgotPassword(email: string) {
    const user = await prisma.registeredUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ErrorResponse("Email is not registered in the system", 404, [
        "email",
      ]);
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiredAt = new Date(new Date().getTime() + 5 * 60000);

    await prisma.resetPasswordToken.create({
      data: {
        token,
        email,
        expired_at: expiredAt,
      },
    });

    sendEmail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `Click this link to reset your password: ${
        process.env.BASE_URL || "http://localhost:3000"
      }/reset-password/${token} \n\n This link will be expired in 5 minutes.`,
    });
  }

  static async employeeResetPassword(uniqueId: string, newPassword: string) {
    //   const request = Validation.validate(AuthValidation.RESET_PASSWORD, {
    //     email: uniqueId,
    //     newPassword,
    //   });
    //   const employee = await prisma.employee.findFirst({
    //     where: { email: request.email },
    //   });
    //   if (!employee) {
    //     throw new ErrorResponse(
    //       "Employee not found",
    //       404,
    //       ["uniqueId"],
    //       "EMPLOYEE_NOT_FOUND"
    //     );
    //   }
    //   const hashedPassword = hashPassword(request.newPassword);
    //   await prisma.employee.update({
    //     where: { email: request.email },
    //     data: {
    //       password: hashedPassword,
    //     },
    //   });
  }
}
