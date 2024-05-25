import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { SickManagementController } from "./sick-management-controller";
const sickManagementRoute: Router = Router();

sickManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  SickManagementController.getAllByCompanyBranchId,
]);

sickManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  SickManagementController.getById,
]);

sickManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  SickManagementController.validateLetter,
]);
sickManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  SickManagementController.deleteLetter,
]);

export default sickManagementRoute;
