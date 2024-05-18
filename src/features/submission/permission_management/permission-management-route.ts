import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { PermissionManagementController } from "./permission-management-controller";
const permissionManagementRoute: Router = Router();

permissionManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  PermissionManagementController.getAllByCompanyBranchId,
]);

permissionManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  PermissionManagementController.getById,
]);

permissionManagementRoute.put("/:submission_id", [
  JWTMiddleware.verifyToken,
  PermissionManagementController.validateLetter,
]);
permissionManagementRoute.delete("/:submission_id", [
  JWTMiddleware.verifyToken,
  PermissionManagementController.deleteLetter,
]);

export default permissionManagementRoute;
