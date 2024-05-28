import { PackageType } from "@prisma/client";
import { z, ZodType } from "zod";

export class MeraihValidation {
  static readonly UPDATE_COMPANY_PACKAGE_TYPE: ZodType = z.object({
    company_id: z.string(),
    package_type: z.enum([PackageType.FREE, PackageType.PREMIUM]),
    package_end: z.string().optional(),
  });
}
