import { prisma } from "../../applications";
import { Validation } from "../../validations";
import {
  CreateBranchResponse,
  CreateCompanyBranch,
} from "./company-branch-model";
import { CompanyBranchValidation } from "./company-branch-validation";

export class CompanyBranchService {
  static async addNewBranch(
    company_id: string,
    data: CreateCompanyBranch
  ): Promise<CreateBranchResponse> {
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
}
