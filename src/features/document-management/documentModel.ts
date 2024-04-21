import { CompanyFile } from '@prisma/client';

export type CreateDocumentRequest = {
  company_id: string;
  description?: string;
  document_file: Express.Multer.File | undefined;
};

export type CreateDocumentResponse = {
  company_id: string;
  file_name: string;
};

export type GetDocumentRequest = {
  company_id: string;
};

export type GetDocumentResponse = CompanyFile;

export type DownloadDocumentRequest = {
  company_file_id: number;
};

// export type DownloadDocumentResponse = CompanyFile;

export type UpdateDocumentRequest = {
  company_file_id: number;
  company_id: string;
  file_name?: string;
  description?: string;
};

export type UpdateDocumentResponse = {
  company_id: string;
  file_name: string;
};

export type DeleteDocumentRequest = {
  company_file_id: number;
  company_id: string;
};

export type DeleteDocumentResponse = {
  company_file_id: number;
  company_id: string;
  file_name: string;
};