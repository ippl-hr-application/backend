import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { ChangeShiftManagementController } from "./change-shift-management-controller";
const changeShiftManagementRoute: Router = Router();

changeShiftManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  ChangeShiftManagementController.getAllByCompanyBranchId,
]);

changeShiftManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ChangeShiftManagementController.getById,
]);

changeShiftManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ChangeShiftManagementController.validateLetter,
]);
changeShiftManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  ChangeShiftManagementController.deleteLetter,
]);

export default changeShiftManagementRoute;
