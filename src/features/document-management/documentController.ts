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
  // static async getDocuments(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { company_id } = req.params;
  //     const documents = await DocumentService.getDocuments({
  //       company_id: company_id as string
  //     });
  //     res.status(200).json({
  //       success: true,
  //       data: documents,
  //       message: "Documents retrieved successfully"
  //     });
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async updateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const document = await DocumentService.updateDocument(req.body);
      res.status(200).json({
        success: true,
        data: {
          ...document
        },
        message: "Document updated successfully"
      });
    } catch (error) {
      next(error)
    }
  }
}