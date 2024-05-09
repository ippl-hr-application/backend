import { Router } from "express";
import { PayrollController } from "./payroll-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const payrollRouter: Router = Router();

payrollRouter.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.getPayrolls,
]);

payrollRouter.get("/employee", [
  JWTMiddleware.verifyToken,
  PayrollController.getUserPayrolls,
])

payrollRouter.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.createPayroll,
]);

payrollRouter.put("/:company_branch_id/:payroll_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.updatePayroll,
]);

payrollRouter.delete("/:company_branch_id/:payroll_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  PayrollController.deletePayroll,
]);

export default payrollRouter;
