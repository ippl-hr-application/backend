import { Router } from "express";
import { SubmissionController } from "./submission-controller";
import { upload } from "../../middlewares/multer";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const submissionRoute: Router = Router();

submissionRoute.post("/permission", [
  JWTMiddleware.verifyToken,
  upload.single("permission_file"),
  SubmissionController.createPermissionLetter,
]);
submissionRoute.post("/sick", [
  JWTMiddleware.verifyToken,
  upload.single("permission_file"),
  SubmissionController.createSickLetter,
]);
submissionRoute.post("/leave", [
  JWTMiddleware.verifyToken,
  upload.single("leave_file"),
  SubmissionController.createLeaveLetter,
]);
submissionRoute.post("/mutation", [
  JWTMiddleware.verifyToken,
  upload.single("mutation_file"),
  SubmissionController.createMutationLetter,
]);
export default submissionRoute;
