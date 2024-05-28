import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ResignManagementController } from "./resign-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const resignManagementRoute: Router = Router();

resignManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ResignManagementController.getAllByCompanyBranchId,
]);

resignManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ResignManagementController.getById,
]);

resignManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ResignManagementController.validateLetter,
]);
resignManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ResignManagementController.deleteLetter,
]);

export default resignManagementRoute;
