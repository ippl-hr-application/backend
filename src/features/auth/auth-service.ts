import { Validation } from "../../validations";
import { prisma } from "../../applications";
import { comparePassword, hashPassword } from "../../utils";
import { ErrorResponse } from "../../models";
import { AuthValidation } from "./auth-validation";
import {
  CurrentLoggedInUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisteredUserWithoutPassword,
} from "./auth-model";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

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
        package_type: "free",
        password: hashedPassword,
        company: {
          create: {
            name: request.company_name,
            industry: request.industry,
            company_branches: {
              create: {
                email: request.email,
                phone_number: request.phone_number,
                hq_initial: "PUSAT",
              },
            },
          },
        },
      },
    });

    return user;
  }

  static async getCurrentLoggedInUser(
    userId: string
  ): Promise<CurrentLoggedInUserResponse> {
    const user = await prisma.registeredUser.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        company: {
          select: {
            name: true,
            industry: true,
          },
        },
        package_type: true,
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
}