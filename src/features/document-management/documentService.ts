import { prisma } from "../../applications";
import { Validation } from "../../validations";
import { DocumentValidation } from "./documentValidation";
import {
  CreateDocumentRequest,
  CreateDocumentResponse,
  GetDocumentRequest,
  GetDocumentResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
  DeleteDocumentRequest,
  DeleteDocumentResponse
} from "./documentModel";

export class DocumentService {
  static async createDocument({
    company_id,
    description,
    document_file
  }: CreateDocumentRequest): Promise<CreateDocumentResponse> {
    const request = Validation.validate(DocumentValidation.CREATE_DOCUMENT, {
      company_id,
      description
    });

    const companyFile = await prisma.companyFile.create({
      data: {
        company_id: request.company_id,
        file_name: document_file?.originalname || "",
        file_size: document_file?.size || 0,
        file_type: document_file?.mimetype || "",
        file_url: `/uploads/company_file/${document_file?.filename}`,
        description: request.description
      }
    });
    return companyFile;
  }
}