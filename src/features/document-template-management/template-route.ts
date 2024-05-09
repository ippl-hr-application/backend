import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { TemplateController } from "./template-controller";
import { upload } from "../../middlewares/multer";

const templateRoute: Router = Router();

templateRoute.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  TemplateController.getAllTemplateDocuments,
])

templateRoute.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  upload.single("template_file"),
  TemplateController.addNewTemplateDocument,
])

templateRoute.post("/:company_branch_id/:template_id", [
  JWTMiddleware.verifyToken,
  upload.single("template_file"),
  TemplateController.updateTemplateDocument,
])

templateRoute.delete("/:company_branch_id/:template_id", [
  JWTMiddleware.verifyToken,
  TemplateController.deleteTemplateDocument,
])

export default templateRoute;