import { CompanyBranches } from "@prisma/client";

export type CreateCompanyBranch = {
  email: string | null;
  phone_number: string | null;
  address: string | null;
  province: string | null;
  city: string | null;
  size: number | null;
  hq_initial: string;
  hq_code: string | null;
  umr: number | null;
  umr_province: number | null;
  umr_city: number | null;
  bpjs: string | null;
  password: string;
};

// export interface BranchResponse extends CreateCompanyBranch {
//   company_branch_id: string;
// }

export type BranchResponse = Omit<CreateCompanyBranch, "password"> & {
  company_branch_id: string;
};

export type EditCompanyBranch = Omit<CreateCompanyBranch, "password"> & {
  longitute: number | null;
  latitute: number | null;
};

export type GetAllBranchesResponse = {
  company_branch_id: string;
  city: string | null;
};
