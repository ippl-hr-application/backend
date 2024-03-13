export type CreateDocumentRequest = {
  company_id: string;
  description?: string;
  document_file: Express.Multer.File;
};

export type CreateDocumentResponse = {
  company_id: string;
  file_name: string;
}

export type GetDocumentRequest = {
  company_id: string;
};

export type GetDocumentResponse = {
  company_file_id: string;
  company_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  description?: string;
  document_file: Express.Multer.File;
};

export type UpdateDocumentRequest = {
  company_id: string;
  file_name?: string;
  description?: string;
};

export type UpdateDocumentResponse = {
  company_id: string;
  file_name?: string;
  description?: string;
};

export type DeleteDocumentRequest = {
  company_file_id: string;
};

export type DeleteDocumentResponse = {
  company_file_id: string;
  company_id: string;
  file_name: string;
};