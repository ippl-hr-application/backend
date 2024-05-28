import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { MutasiManagementController } from "./mutasi-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const mutasiManagementRoute: Router = Router();

mutasiManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  MutasiManagementController.getAllByCompanyBranchId,
]);

mutasiManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  MutasiManagementController.getById,
]);

mutasiManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  MutasiManagementController.validateLetter,
]);
mutasiManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  MutasiManagementController.deleteLetter,
]);
export default mutasiManagementRoute;
