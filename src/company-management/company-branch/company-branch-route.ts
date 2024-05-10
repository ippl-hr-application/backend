import { Router } from "express";
import { CompanyBranchController } from "./company-branch-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { PackageTypeMiddleware } from "../../middlewares/package_type_middleware";

const companyBranchRoute: Router = Router();

companyBranchRoute.get("/statistics/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyBranchController.getStatistics,
]);

companyBranchRoute.post("/create", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.addNewBranch,
]);

companyBranchRoute.put("/edit/:company_branch_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.editBranch,
]);

companyBranchRoute.get("/all", [
  JWTMiddleware.verifyToken,
  CompanyBranchController.getAllBranches,
]);

companyBranchRoute.delete("/delete/:company_branch_id", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.deleteBranch,
]);

export default companyBranchRoute;