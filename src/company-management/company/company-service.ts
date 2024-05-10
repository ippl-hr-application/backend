import { Company } from "@prisma/client";
import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { Validation } from "../../validations";
import { CompanyValidation } from "./company-validation";
import { EditCompanyRequest } from "./company-model";

export class CompanyService {
  static async editCompany(
    company_id: string,
    data: EditCompanyRequest
  ): Promise<Company> {
    const validatedData = Validation.validate(
      CompanyValidation.EDIT_COMPANY,
      data
    );

    const company = await prisma.company.findFirst({
      where: {
        company_id: company_id,
      },
    });

    if (!company) {
      throw new ErrorResponse("Company not found", 404, ["company_id"]);
    }

    const updatedCompany = await prisma.company.update({
      where: {
        company_id: company_id,
      },
      data: {
        name: validatedData.name,
        industry: validatedData.industry,
        npwp_digit: validatedData.npwp_digit,
      },
    });

    return updatedCompany;
  }
}
