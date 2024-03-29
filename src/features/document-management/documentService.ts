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
} from './documentModel';
import fs from 'fs';
import { ErrorResponse } from '../../models';

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
    const baseFileName = document_file?.originalname || '';
    const lastDotIndex = baseFileName.lastIndexOf('.');
    const baseFileNameWithoutExtension = baseFileName.slice(0, lastDotIndex);
    const fileExtension = baseFileName.slice(lastDotIndex + 1);

    let fileName = baseFileNameWithoutExtension;
    let fileNameWithType = baseFileName;
    let count = 1;

    while (true) {
      const name_file = await prisma.companyFile.findMany({
        where: {
          file_name: fileNameWithType,
        },
      });

      if (!name_file.length) {
        break;
      }

      fileName = baseFileNameWithoutExtension; // Reset nama file
      fileNameWithType = `${fileName}(${count}).${fileExtension}`;
      count++;
    }

    const companyFile = await prisma.companyFile.create({
      data: {
        company_id: request.company_id,
        file_name: fileNameWithType,
        file_size: document_file?.size || 0,
        file_type: document_file?.mimetype || '',
        file_url: `/uploads/company_file/${fileNameWithType}`,
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
    // fs.unlinkSync(`./public/uploads/company_file/${companyFile.file_name}`);
    await prisma.companyFile.delete({
      where: {
        company_file_id: request.company_file_id,
        company_id: request.company_id,
      },
    });

    // Hapus file dari sistem

    return companyFile;
  }
}