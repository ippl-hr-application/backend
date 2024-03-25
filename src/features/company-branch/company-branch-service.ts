import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import {
  BranchResponse,
  CreateCompanyBranch,
  EditCompanyBranch,
} from "./company-branch-model";
import { CompanyBranchValidation } from "./company-branch-validation";

export class CompanyBranchService {
  static async addNewBranch(
    company_id: string,
    data: CreateCompanyBranch
  ): Promise<BranchResponse> {
    const validate = Validation.validate(
      CompanyBranchValidation.CREATE_NEW_BRANCH,
      data
    );

    const branch = await prisma.companyBranches.create({
      data: {
        company_id,
        ...validate,
      },
    });

    return branch;
  }

  static async editBranch(
    company_branch_id: string,
    data: EditCompanyBranch
  ): Promise<BranchResponse> {
    const validate = Validation.validate(
      CompanyBranchValidation.EDIT_BRANCH,
      data
    );

    const isBranchExist = await prisma.companyBranches.findFirst({
      where: { company_branch_id },
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
}
