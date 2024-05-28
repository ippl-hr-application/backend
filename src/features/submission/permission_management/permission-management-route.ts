import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { PermissionManagementController } from "./permission-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const permissionManagementRoute: Router = Router();

permissionManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PermissionManagementController.getAllByCompanyBranchId,
]);

permissionManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PermissionManagementController.getById,
]);

permissionManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PermissionManagementController.validateLetter,
]);
permissionManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PermissionManagementController.deleteLetter,
]);

export default permissionManagementRoute;
