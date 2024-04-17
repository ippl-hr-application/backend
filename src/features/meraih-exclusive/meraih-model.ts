import { PackageType } from "@prisma/client";

export type UpdateUserPackageTypeRequets = {
  company_id: string;
  package_type: PackageType;
  package_end: string;
}