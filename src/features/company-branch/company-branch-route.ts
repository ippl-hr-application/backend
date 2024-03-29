import { Router } from "express";
import { CompanyBranchController } from "./company-branch-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { PackageTypeMiddleware } from "../../middlewares/package_type_middleware";

const companyBranchRoute: Router = Router();

companyBranchRoute.post("/create", [
  JWTMiddleware.verifyToken,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.addNewBranch,
]);

companyBranchRoute.put("/edit/:company_branch_id", [
  JWTMiddleware.verifyToken,
  PackageTypeMiddleware.isPackagePremium,
  CompanyBranchController.editBranch,
]);

export default companyBranchRoute;
