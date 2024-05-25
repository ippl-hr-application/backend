import { Router } from "express";
import { CompanyBranchController } from "./company-branch-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { PackageTypeMiddleware } from "../../middlewares/package_type_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const companyBranchRoute: Router = Router();


companyBranchRoute.post("/create", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.addNewBranch,
]);

companyBranchRoute.get("/all", [
  JWTMiddleware.verifyToken,
  CompanyBranchController.getAllBranches,
]);

companyBranchRoute.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  CompanyBranchController.getBranchById,
])

companyBranchRoute.get("/statistics/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  CompanyBranchController.getStatistics,
]);

companyBranchRoute.put("/edit/:company_branch_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  CompanyBranchController.editBranch,
]);

companyBranchRoute.delete("/delete/:company_branch_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.deleteBranch,
]);

export default companyBranchRoute;
