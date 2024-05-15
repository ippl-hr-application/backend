import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { LeaveManagementController } from "./leave-management-controller";
const leaveManagementRoute: Router = Router();

leaveManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  LeaveManagementController.getAllByCompanyBranchId,
]);

leaveManagementRoute.get("/:submission_id", [
  JWTMiddleware.verifyToken,
  LeaveManagementController.getById,
]);

leaveManagementRoute.put("/:submission_id", [
  JWTMiddleware.verifyToken,
  LeaveManagementController.validateLetter,
]);
leaveManagementRoute.delete("/:submission_id", [
  JWTMiddleware.verifyToken,
  LeaveManagementController.deleteLetter,
]);

export default leaveManagementRoute;
