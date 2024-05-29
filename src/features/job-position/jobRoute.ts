import { Router } from "express";
import { JobPositionController } from "./jobController";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";

const jobPositionRoute: Router = Router();

jobPositionRoute.get('/:company_branch_id', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JobPositionController.getJobPosition
]);
jobPositionRoute.post('/', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  JobPositionController.createJobPosition
]);
jobPositionRoute.put('/update', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  JobPositionController.updateJobPosition
]);
jobPositionRoute.delete('/delete', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  JobPositionController.deleteJobPosition
]);

export default jobPositionRoute;