import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { LeaveManagementController } from "./leave-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const leaveManagementRoute: Router = Router();

leaveManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  LeaveManagementController.getAllByCompanyBranchId,
]);

leaveManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  LeaveManagementController.getById,
]);

leaveManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  LeaveManagementController.validateLetter,
]);
leaveManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  LeaveManagementController.deleteLetter,
]);

export default leaveManagementRoute;
