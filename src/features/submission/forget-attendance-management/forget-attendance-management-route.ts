import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ForgetAttendanceManagementController } from "./forget-attendance-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const forgetAttendanceManagementRoute: Router = Router();

forgetAttendanceManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ForgetAttendanceManagementController.getAllByCompanyBranchId,
]);

forgetAttendanceManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ForgetAttendanceManagementController.getById,
]);

forgetAttendanceManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ForgetAttendanceManagementController.validateLetter,
]);
forgetAttendanceManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ForgetAttendanceManagementController.deleteLetter,
]);

export default forgetAttendanceManagementRoute;
