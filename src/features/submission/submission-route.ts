import { Router } from "express";
import { SubmissionController } from "./submission-controller";
import { upload } from "../../middlewares/multer";

const submissionRoute: Router = Router();

submissionRoute.post("/permission", [
  upload.single("permission_file"),
  SubmissionController.createPermissionLetter,
]);
submissionRoute.post("/sick", [
  upload.single("permission_file"),
  SubmissionController.createSickLetter,
]);
export default submissionRoute;
