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
  upload.single("sick_file"),
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
submissionRoute.post("/change-shift", [
  JWTMiddleware.verifyToken,
  SubmissionController.createChangeShiftLetter,
]);

submissionRoute.post("/resign", [
  JWTMiddleware.verifyToken,
  upload.single("resign_file"),
  SubmissionController.createResignLetter,
]);

submissionRoute.delete("/:submission_id", [
  JWTMiddleware.verifyToken,
  SubmissionController.deleteSubmission,
]);
submissionRoute.get("/", [
  JWTMiddleware.verifyToken,
  SubmissionController.getSubmissionHistory,
]);

submissionRoute.post("/attendance", [
  JWTMiddleware.verifyToken,
  upload.single("attendance_submission_file"),
  SubmissionController.createAttendanceLetter,
]);

export default submissionRoute;
