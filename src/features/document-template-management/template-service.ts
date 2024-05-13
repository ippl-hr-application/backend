import { prisma } from "../../applications";
import { ErrorResponse } from "../../models";
import { deleteFile } from "../../utils/delete_file";
import { pathToFileUrl } from "../../utils/format";
import { Validation } from "../../validations";
import { addNewTemplateDocumentRequest } from "./template-model";
import { TemplateValidation } from "./template-validation";

export class TemplateService {
  static async getAllTemplateDocuments(
    company_branch_id: string,
    desc?: string
  ) {
    const templates = await prisma.companyFile.findMany({
      where: {
        company_id: company_branch_id,
        description: desc
          ? {
              contains: desc,
              mode: "insensitive",
            }
          : undefined,
      },
    });

    return templates;
  }

  static async addNewTemplateDocument(
    document: Express.Multer.File,
    data: addNewTemplateDocumentRequest
  ) {
    const { description, company_id } = Validation.validate(
      TemplateValidation.ADD_NEW_TEMPLATE_DOCUMENT,
      data
    );

    const template = await prisma.companyFile.create({
      data: {
        company: {
          connect: {
            company_id,
          },
        },
        file_name: document.originalname,
        file_type: document.mimetype,
        file_size: document.size,
        description,
        file_url: pathToFileUrl(
          document.path,
          process.env.SERVER_URL || "http://localhost:3000"
        ),
        company_file_template: {
          create: {
            company_id,
            description,
          },
        },
      },
    });

    return template;
  }

  static async deleteTemplateDocument(
    company_id: string,
    template_document_id: number
  ) {
    const template = await prisma.companyFile.findFirst({
      where: {
        company_id,
        company_file_id: template_document_id,
      },
    });

    if (!template) {
      throw new ErrorResponse(
        "Template document not found",
        404,
        ["company_id", "template_id"],
        "TEMPLATE_NOT_FOUND"
      );
    }

    await deleteFile(template.file_url);

    await prisma.companyFileTemplate.delete({
      where: {
        company_id,
        company_file_template_id: template_document_id,
      },
    });

    await prisma.companyFile.delete({
      where: {
        company_id,
        company_file_id: template_document_id,
      },
    });

    return template;
  }

  static async updateTemplateDocument(
    document: Express.Multer.File,
    template_document_id: number,
    data: addNewTemplateDocumentRequest
  ) {
    const { description, company_id } = Validation.validate(
      TemplateValidation.ADD_NEW_TEMPLATE_DOCUMENT,
      data
    );

    const template = await prisma.companyFile.findFirst({
      where: {
        company_id,
        company_file_id: template_document_id,
      },
    });

    if (!template) {
      throw new ErrorResponse(
        "Template document not found",
        404,
        ["company_id", "template_id"],
        "TEMPLATE_NOT_FOUND"
      );
    }

    await deleteFile(template.file_url);

    const updatedTemplate = await prisma.companyFile.update({
      where: {
        company_file_id: template_document_id,
      },
      data: {
        file_name: document.originalname,
        file_type: document.mimetype,
        file_size: document.size,
        description,
        file_url: pathToFileUrl(
          document.path,
          process.env.SERVER_URL || "http://localhost:3000"
        ),
      },
    });

    return updatedTemplate;
  }
}
