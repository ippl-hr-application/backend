import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { SickManagementController } from "./sick-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const sickManagementRoute: Router = Router();

sickManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  SickManagementController.getAllByCompanyBranchId,
]);

sickManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  SickManagementController.getById,
]);

sickManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  SickManagementController.validateLetter,
]);
sickManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  SickManagementController.deleteLetter,
]);

export default sickManagementRoute;
