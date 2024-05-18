import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ForgetAttendanceManagementController } from "./forget-attendance-management-controller";
const forgetAttendanceManagementRoute: Router = Router();

forgetAttendanceManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  ForgetAttendanceManagementController.getAllByCompanyBranchId,
]);

forgetAttendanceManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ForgetAttendanceManagementController.getById,
]);

forgetAttendanceManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ForgetAttendanceManagementController.validateLetter,
]);
forgetAttendanceManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ForgetAttendanceManagementController.deleteLetter,
]);

export default forgetAttendanceManagementRoute;
