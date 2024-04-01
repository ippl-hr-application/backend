import { Router } from "express";
import { SubmissionController } from "./submission-controller";
import { upload } from "../../middlewares/multer";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const submissionRoute: Router = Router();

submissionRoute.post("/permission", [
  JWTMiddleware.verifyToken,
  SubmissionController.createPermissionLetter,
]);
submissionRoute.post("/sick", [
  JWTMiddleware.verifyToken,
  SubmissionController.createSickLetter,
]);
submissionRoute.post("/leave", [
  JWTMiddleware.verifyToken,
  SubmissionController.createLeaveLetter,
]);
submissionRoute.post("/mutation", [
  JWTMiddleware.verifyToken,
  SubmissionController.createMutationLetter,
]);
submissionRoute.post("/change-shift", [
  JWTMiddleware.verifyToken,
  SubmissionController.createChangeShiftLetter,
]);
submissionRoute.delete("/:id", [
  JWTMiddleware.verifyToken,
  SubmissionController.deleteSubmission,
]);
submissionRoute.get("/", [
  JWTMiddleware.verifyToken,
  SubmissionController.getSubmissionHistory,
]);
export default submissionRoute;
