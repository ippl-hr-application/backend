import { prisma } from '../../applications';
import { Validation } from '../../validations';
import { DocumentValidation } from './documentValidation';

import {
  CreateDocumentRequest,
  CreateDocumentResponse,
  GetDocumentRequest,
  GetDocumentResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
  DeleteDocumentRequest,
  DeleteDocumentResponse,
  DownloadDocumentRequest,
  // DownloadDocumentResponse,
} from './documentModel';
import fs from 'fs';
import { ErrorResponse } from '../../models';
import { pathToFileUrl } from "../../utils/format";

export class DocumentService {
  static async createDocument({
    company_id,
    description,
    document_file,
  }: CreateDocumentRequest): Promise<CreateDocumentResponse> {
    const request = Validation.validate(DocumentValidation.CREATE_DOCUMENT, {
      company_id,
      description,
    });
    // -------------------------
    const companyFile = await prisma.companyFile.create({
      data: {
        company_id: request.company_id,
        file_name: document_file?.originalname || '',
        file_size: document_file?.size || 0,
        file_type: document_file?.mimetype || '',
        file_url: document_file?.path || "",
        description: request.description,
      },
    });

    return companyFile;
  }

  static async getDocuments({
    company_id,
  }: GetDocumentRequest): Promise<GetDocumentResponse[]> {
    const request = Validation.validate(DocumentValidation.GET_DOCUMENT, {
      company_id,
    });

    const companyFiles = await prisma.companyFile.findMany({
      where: {
        company_id: request.company_id,
      },
    });

    return companyFiles;
  }

  static async downloadDocument({
    company_file_id,
  }: DownloadDocumentRequest) {

    const companyFile = await prisma.companyFile.findFirst({
      where: {
        company_file_id: company_file_id
      },
    });

    if (!companyFile) {
      throw new ErrorResponse(
        'File not found',
        404,
        ['company_file_id'],
        'FILE_NOT_FOUND'
      );
    }

    return companyFile;
  }

  static async updateDocument(
    requestUpdate: UpdateDocumentRequest
  ): Promise<UpdateDocumentResponse> {
    const request = Validation.validate(
      DocumentValidation.UPDATE_DOCUMENT,
      requestUpdate
    );

    const companyFile = await prisma.companyFile.update({
      where: {
        company_file_id: request.company_file_id,
        company_id: request.company_id,
      },
      data: { ...request },
    });

    return companyFile;
  }

  static async deleteDocument({
    company_id,
    company_file_id,
  }: DeleteDocumentRequest): Promise<DeleteDocumentResponse> {
    const request = Validation.validate(DocumentValidation.DELETE_DOCUMENT, {
      company_id,
      company_file_id,
    });
    const companyFile = await prisma.companyFile.findFirst({
      where: {
        company_file_id: request.company_file_id,
        company_id: request.company_id,
      },
    });

    if (!companyFile) {
      throw new ErrorResponse(
        'File not found',
        404,
        ['company_file_id'],
        'FILE_NOT_FOUND'
      );
    }
    await prisma.companyFile.delete({
      where: {
        company_file_id: request.company_file_id,
        company_id: request.company_id,
      },
    });
    return companyFile;
  }
}