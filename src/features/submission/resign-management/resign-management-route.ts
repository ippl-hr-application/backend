import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ResignManagementController } from "./resign-management-controller";
const resignManagementRoute: Router = Router();

resignManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  ResignManagementController.getAllByCompanyBranchId,
]);

resignManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.getById,
]);

resignManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.validateLetter,
]);
resignManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.deleteLetter,
]);

export default resignManagementRoute;
