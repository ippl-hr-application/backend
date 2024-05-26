import { Router } from "express";
import { PayrollController } from "./payroll-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const payrollRouter: Router = Router();

payrollRouter.get("/:company_branch_id/employee", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.getUserPayrolls,
])

payrollRouter.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.getPayrolls,
]);

payrollRouter.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  PayrollController.createPayroll,
]);

payrollRouter.put("/:company_branch_id/:payroll_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  PayrollController.updatePayroll,
]);

payrollRouter.delete("/:company_branch_id/:payroll_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  PayrollController.deletePayroll,
]);

export default payrollRouter;
