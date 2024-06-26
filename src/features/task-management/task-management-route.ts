import { Router } from "express";
import { TaskManagementController } from "./task-management-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { CompanyMiddleware } from "../../middlewares/company_middleware";
const taskManagementRouter: Router = Router();

taskManagementRouter.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  TaskManagementController.getTaskManagementFromCompany,
]);

taskManagementRouter.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  TaskManagementController.addTaskManagement,
]);

taskManagementRouter.get("/:company_branch_id/employee", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  TaskManagementController.getTaskEmployee,
]);

taskManagementRouter.get("/:company_branch_id/:task_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  TaskManagementController.getTaskById,
]);

taskManagementRouter.put("/:company_branch_id/:task_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  TaskManagementController.updateTaskManagement,
]);

taskManagementRouter.delete("/:company_branch_id/:task_id", [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  TaskManagementController.deleteTaskManagement,
]);

export default taskManagementRouter;
