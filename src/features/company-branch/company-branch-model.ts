import { CompanyBranches } from "@prisma/client";

export type CreateCompanyBranch = {
  email: string | null;
  phone_number: string | null;
  address: string | null;
  province: string | null;
  city: string | null;
  size: number | null;
  hq_initial: string | null;
  hq_code: string | null;
  umr: number | null;
  umr_province: number | null;
  umr_city: number | null;
  bpjs: string | null;
};

export interface CreateBranchResponse extends CreateCompanyBranch {
  company_branch_id: string;
}
