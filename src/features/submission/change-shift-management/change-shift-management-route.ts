import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ChangeShiftManagementController } from "./change-shift-management-controller";
import { CompanyMiddleware } from "../../../middlewares/company_middleware";
const changeShiftManagementRoute: Router = Router();

changeShiftManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ChangeShiftManagementController.getAllByCompanyBranchId,
]);

changeShiftManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ChangeShiftManagementController.getById,
]);

changeShiftManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ChangeShiftManagementController.validateLetter,
]);
changeShiftManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  ChangeShiftManagementController.deleteLetter,
]);

export default changeShiftManagementRoute;
