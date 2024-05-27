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
  file_url: string;
  company_branch_id: string;
  date: Date;
};

export type UpdateAnnouncementRequest = Omit<
  CreateAnnouncementRequest,
  'company_branch_id' 
  > & { 
    company_announcement_id: number;
    company_branch_id_add?: string[];
    company_branch_id_remove?: string[];
};

export type UpdateAnnouncementResponse = {
  company_id: string;
  title: string;
  description: string;
  company_announcement_id: number;
  file_name: string;
  file_url: string; 
  company_branch_id_add?: string[]; 
  company_branch_id_remove?: string[]};

export type EzCreateAnnouncementRequest = {
  company_branch_id: string;
  title: string;
  description: string;
  file_attachment: Express.Multer.File | undefined;
};

export type EzCreateAnnouncementResponse = {
  company_branch_id: string;
  title: string;
  description: string;
  company_announcement_id: number;
  file_name: string;
  file_url: string;
  date: Date;
  created_at: Date;
};

export type EzUpdateAnnouncementRequest = EzCreateAnnouncementRequest & { company_announcement_id: number }

export type EzUpdateAnnouncementResponse = {
  company_announcement_id: number,
  company_branch_id: string,
  title: string,
  description: string,
}
