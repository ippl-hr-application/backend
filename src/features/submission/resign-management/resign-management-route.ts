import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ResignManagementController } from "./resign-management-controller";
const resignManagementRoute: Router = Router();

resignManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  ResignManagementController.getAllByCompanyBranchId,
]);

resignManagementRoute.get("/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.getById,
]);

resignManagementRoute.put("/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.validateLetter,
]);
resignManagementRoute.delete("/:submission_id", [
  JWTMiddleware.verifyToken,
  ResignManagementController.deleteLetter,
]);

export default resignManagementRoute;
