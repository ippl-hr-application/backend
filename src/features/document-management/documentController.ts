import { NextFunction, Request, Response } from "express";
import { DocumentService } from "./documentService";

export class DocumentController {
  static async createDocuments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id, description } = req.body;
      const document_file: Express.Multer.File | undefined = req.file;
      const document = await DocumentService.createDocument({
        company_id,
        description,
        document_file
      });
      res.status(201).json({
        success: true,
        data: {
          ...document
        },
        message: "Document created successfully"
      });
    } catch (error) {
      next(error)
    }
  }
}