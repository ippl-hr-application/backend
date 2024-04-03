import {
  CompanyAnnouncement,
  CompanyAnnouncementTo,
  CompanyAnnouncementFileAttachment,
} from '@prisma/client'; 
import exp from 'constants';

export type CreateAnnouncementRequest = {
  company_id: string;
  title: string;
  description: string;
  company_branch_id?: string[];
  file_attachment: Express.Multer.File | undefined;
};

export type CreateAnnouncementResponse = {
  company_id: string;
  title: string;
  description: string;
  company_announcement_id: number;
  file_name: string;
  company_branch_id: string;
};


export type UpdateAnnouncementRequest = Omit<
  CreateAnnouncementRequest,
  'company_branch_id' | 'announcement_id'
>;

