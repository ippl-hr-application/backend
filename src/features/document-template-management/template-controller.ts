import { NextFunction, Request, Response } from "express";
import { EmployeeToken, UserToken } from "../../models";
import { TemplateService } from "./template-service";

export class TemplateController {
  static async getAllTemplateDocuments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { desc } = req.query;

      const templates = await TemplateService.getAllTemplateDocuments(
        company_branch_id,
        desc as string
      );

      return res.status(200).json({
        success: true,
        message: "Document templates retrieved successfully",
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addNewTemplateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { description } = req.body;
      const document = req.file as Express.Multer.File;

      const template = await TemplateService.addNewTemplateDocument(document, {
        company_id: company_branch_id,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Document template created successfully",
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id } = req.params;
      const { template_id } = req.params;

      const template = await TemplateService.deleteTemplateDocument(
        company_branch_id,
        parseInt(template_id)
      );

      return res.status(200).json({
        success: true,
        message: "Document template deleted successfully",
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTemplateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_branch_id, template_id } = req.params;
      const { description } = req.body;
      const document = req.file as Express.Multer.File;

      const template = await TemplateService.updateTemplateDocument(
        document,
        parseInt(template_id),
        { company_id: company_branch_id, description }
      );

      return res.status(200).json({
        success: true,
        message: "Document template updated successfully",
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }
}
