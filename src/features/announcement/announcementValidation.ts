import { z, ZodType } from 'zod';

export class AnnouncementValidation {
  static readonly CREATE_ANNOUNCEMENT: ZodType = z.object({
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(255)
  });

  static readonly UPDATE_ANNOUNCEMENT: ZodType = z.object({
    company_id: z.string(),
    company_announcement_id: z.number(),
    title: z.string().min(3).max(50).optional(),
    description: z.string().min(3).max(255).optional(),
  });

  static readonly EZ_CREATE_ANNOUNCEMENT: ZodType = z.object({
    company_branch_id: z.string(),
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(255)
  });

  static readonly EZ_UPDATE_ANNOUNCEMENT: ZodType = z.object({
    company_branch_id: z.string(),
    company_announcement_id: z.number(),
    title: z.string().min(3).max(50).optional(),
    description: z.string().min(3).max(255).optional(),
  });
}