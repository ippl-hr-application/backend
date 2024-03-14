import { Router } from "express";
import { DocumentController } from "./documentController";
import { upload } from "../../middlewares/multer";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const documentRoute: Router = Router();

documentRoute.post("/", [
  JWTMiddleware.verifyToken,
  upload.single("document_file"),
  DocumentController.createDocuments,
]);

export default documentRoute;