import { Router } from "express";
import { EmploymentController } from "./employmentController";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const employmentRoute: Router = Router();

employmentRoute.get('/:company_branch_id', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  EmploymentController.getEmploymentStatus
]);
employmentRoute.post('/', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  EmploymentController.createEmploymentStatus
]);
employmentRoute.put('/update', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  EmploymentController.updateEmploymentStatus
]);
employmentRoute.delete('/delete', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  EmploymentController.deleteEmploymentStatus
]);

export default employmentRoute;