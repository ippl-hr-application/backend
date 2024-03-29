import { Router } from "express";
import { TaskManagementController } from "./task-management-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
const taskManagementRouter: Router = Router();

taskManagementRouter.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.getTaskManagementFromCompany,
]);

taskManagementRouter.post("/", [
  JWTMiddleware.verifyToken,
  TaskManagementController.addTaskManagement,
]);

taskManagementRouter.put("/:company_branch_id/:task_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.updateTaskManagement,
]);

taskManagementRouter.delete("/:company_branch_id/:task_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.deleteTaskManagement,
]);

export default taskManagementRouter;
