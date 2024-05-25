import { Prisma } from "@prisma/client";
import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import {
  BranchResponse,
  CreateCompanyBranch,
  EditCompanyBranch,
  GetAllBranchesResponse,
} from "./company-branch-model";
import { CompanyBranchValidation } from "./company-branch-validation";

export class CompanyBranchService {
  static async addNewBranch(
    company_id: string,
    user_id: string,
    data: CreateCompanyBranch
  ): Promise<BranchResponse> {
    const validate = Validation.validate(
      CompanyBranchValidation.CREATE_NEW_BRANCH,
      data
    );

    const newData = (({ password, ...d }) => ({ ...d }))(validate);

    return prisma.$transaction(async (prisma) => {
      const branch = await prisma.companyBranches.create({
        data: {
          company_id,
          ...newData,
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

      const user = await prisma.registeredUser.findFirst({
        where: {
          user_id,
        },
      });

      await prisma.employee.create({
        data: {
          company_branch_id: branch.company_branch_id,
          email: user!.email,
          password: validate.password,
          first_name: (user!.full_name as string).split(" ")[0],
          last_name: (user!.full_name as string).split(" ")[1] || "",
          phone_number: user!.phone_number,
          job_position_id: branch.job_positions.find(
            (job) => job.name === "Owner"
          )!.job_position_id,
          employment_status_id: branch.employment_statuses.find(
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

      return branch;
    });
  }

  static async editBranch(
    company_id: string,
    company_branch_id: string,
    data: EditCompanyBranch
  ): Promise<BranchResponse> {
    const validate = Validation.validate(
      CompanyBranchValidation.EDIT_BRANCH,
      data
    );

    const isBranchExist = await prisma.companyBranches.findFirst({
      where: { company_branch_id, company_id },
    });

    if (!isBranchExist) {
      throw new ErrorResponse("Branch not found", 404, ["company_branch_id"]);
    }

    const branch = await prisma.companyBranches.update({
      where: { company_branch_id },
      data: { ...validate },
    });

    return branch;
  }

  static async getAllBranches(
    company_id: string
  ): Promise<GetAllBranchesResponse[]> {
    // const company = await prisma.companyBranches.findUnique({
    //   where: {
    //     company_id,
    //   },
    //   select: {
    //     company_id: true,
    //   },
    // });
    // if (!company) {
    //   throw new ErrorResponse("Company not found", 404, ["company_branch_id"]);
    // }
    const branches = await prisma.companyBranches.findMany({
      where: {
        company_id: company_id,
      },
    });
    return branches;
  }

  static async getStatistics(company_branch_id: string) {
    const employeeCount = await prisma.employee.count({
      where: {
        company_branch_id,
      },
    });

    const employeeGenderData = await prisma.employee.groupBy({
      _count: {
        employee_id: true,
      },
      by: ["gender", "company_branch_id"],
      having: {
        company_branch_id,
      },
    });

    const employeeGenderCount: { [gender: string]: number } = {};

    employeeGenderData.forEach((data) => {
      employeeGenderCount[data.gender] = data._count.employee_id;
    });

    const jobPositionCount = await prisma.employee.count({
      where: {
        company_branch_id,
      },
    });

    const employmentStatusCount = await prisma.employmentStatus.count({
      where: {
        company_branch_id,
      },
    });

    return {
      employee_count: employeeCount,
      employee_gender_count: employeeGenderCount,
      job_position_count: jobPositionCount,
      employment_status_count: employmentStatusCount,
    };
  }

  static async deleteBranch(company_id: string, company_branch_id: string) {
    const isCompanyBranchExists = await prisma.companyBranches.findFirst({
      where: { company_id, company_branch_id },
    });

    if (!isCompanyBranchExists)
      throw new ErrorResponse(
        "Branch not found",
        404,
        ["company_branch_id"],
        "BRANCH_NOT_FOUND"
      );

    return prisma.$transaction(async (prisma) => {
      await prisma.companyAnnouncementTo.deleteMany({
        where: { company_branch_id },
      });

      await prisma.employee.deleteMany({
        where: { company_branch_id },
      });

      await prisma.employeeTask.deleteMany({
        where: { company_branch_id },
      });

      await prisma.employmentStatus.deleteMany({
        where: { company_branch_id },
      });

      await prisma.reimbursement.deleteMany({
        where: { company_branch_id },
      });

      await prisma.attendance.deleteMany({
        where: { company_branch_id },
      });

      await prisma.jobPosition.deleteMany({
        where: { company_branch_id },
      });

      await prisma.assignShift.deleteMany({
        where: { company_branch_id },
      });

      await prisma.mutationSubmission.deleteMany({
        where: {
          OR: [
            { current_company_branch_id: company_branch_id },
            { target_company_branch_id: company_branch_id },
          ],
        },
      });

      await prisma.payroll.deleteMany({
        where: { company_branch_id },
      });

      await prisma.companyFileTemplate.deleteMany({
        where: { company_id: company_branch_id },
      });

      await prisma.companyBranches.delete({
        where: { company_branch_id, company_id },
        include: {
          job_positions: true,
          employment_statuses: true,
          employees: true,
          employee_tasks: true,
        },
      });
    });
  }

  static async getBranchById(company_branch_id: string) {
    const branch = await prisma.companyBranches.findFirst({
      where: {
        company_branch_id,
      },
    });

    if (!branch) {
      throw new ErrorResponse("Branch not found", 404, ["company_branch_id"]);
    }

    return branch;
  }
}
