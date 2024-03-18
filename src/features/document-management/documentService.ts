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
  DeleteDocumentResponse,
} from "./documentModel";
import fs from "fs";
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

  // static async getDocuments({
  //   company_id
  // }: GetDocumentRequest): Promise<GetDocumentResponse[]> {
  //   const request = Validation.validate(DocumentValidation.GET_DOCUMENT, {
  //     company_id
  //   });

  //   const companyFiles = await prisma.companyFile.findMany({
  //     where: {
  //       company_id: request.company_id
  //     }
  //   });

  //   // Mapping companyFiles untuk menambahkan properti document_file
  //   const documents: GetDocumentResponse[] = companyFiles.map(file => ({
  //     company_id: file.company_id,
  //     file_name: file.file_name,
  //     file_size: file.file_size,
  //     file_type: file.file_type,
  //     description: file.description || undefined,
  //     document_file: [] // Fix: Set document_file as an empty array
  //   }));

  //   return documents;
  // }

  static async updateDocument(
    requestUpdate
  : UpdateDocumentRequest): Promise<UpdateDocumentResponse> {
    const request = Validation.validate(DocumentValidation.UPDATE_DOCUMENT,
      requestUpdate
    );

    const companyFile = await prisma.companyFile.update({
      where: {
        company_file_id: request.company_file_id,
        company_id: request.company_id
      },
      data: { ... request}
    });

    return companyFile;
  }
}