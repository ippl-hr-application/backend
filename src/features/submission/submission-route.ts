import { Router } from "express";
import { SubmissionController } from "./submission-controller";
import { upload } from "../../middlewares/multer";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

import { changeShiftManagementRoute } from "./change-shift-management";
import { sickManagementRoute } from "./sick-management";
import { resignManagementRoute } from "./resign-management";
import { permissionManagementRoute } from "./permission_management";
import { leaveManagementRoute } from "./leave-management";
import { mutasiManagementRoute } from "./mutasi-management";
import { forgetAttendanceManagementRoute } from "./forget-attendance-management";

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
submissionRoute.use("/sick-management", sickManagementRoute);
submissionRoute.use("/permission-management", permissionManagementRoute);
submissionRoute.use("/change-shift-management", changeShiftManagementRoute);
submissionRoute.use("/resign-management", resignManagementRoute);
submissionRoute.use("/leave-management", leaveManagementRoute);
submissionRoute.use("/mutation-management", mutasiManagementRoute);
submissionRoute.use(
  "/forget-attendance-management",
  forgetAttendanceManagementRoute
);
export default submissionRoute;
