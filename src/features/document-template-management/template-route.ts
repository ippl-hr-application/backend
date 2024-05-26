import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { TemplateController } from "./template-controller";
import { upload } from "../../middlewares/multer";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const templateRoute: Router = Router();

templateRoute.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  TemplateController.getAllTemplateDocuments,
])

templateRoute.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  upload.single("template_file"),
  TemplateController.addNewTemplateDocument,
])

templateRoute.post("/:company_branch_id/:template_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  upload.single("template_file"),
  TemplateController.updateTemplateDocument,
])

templateRoute.delete("/:company_branch_id/:template_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  TemplateController.deleteTemplateDocument,
])

export default templateRoute;