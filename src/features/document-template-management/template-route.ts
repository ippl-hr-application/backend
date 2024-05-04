import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { TemplateController } from "./template-controller";
import { upload } from "../../middlewares/multer";

const templateRoute: Router = Router();

templateRoute.get("/", [
  JWTMiddleware.verifyToken,
  TemplateController.getAllTemplateDocuments,
])

templateRoute.post("/", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.employeeOnly,
  upload.single("template_file"),
  TemplateController.addNewTemplateDocument,
])

templateRoute.post("/:template_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.employeeOnly,
  upload.single("template_file"),
  TemplateController.updateTemplateDocument,
])

templateRoute.delete("/:template_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.employeeOnly,
  TemplateController.deleteTemplateDocument,
])

export default templateRoute;