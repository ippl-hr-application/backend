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
  upload.single("template_file"),
  TemplateController.addNewTemplateDocument,
])

templateRoute.post("/:template_id", [
  JWTMiddleware.verifyToken,
  upload.single("template_file"),
  TemplateController.updateTemplateDocument,
])

templateRoute.delete("/:template_id", [
  JWTMiddleware.verifyToken,
  TemplateController.deleteTemplateDocument,
])

export default templateRoute;