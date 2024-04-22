import { Router } from "express";
import { TaskManagementController } from "./task-management-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
const taskManagementRouter: Router = Router();

taskManagementRouter.get("/", [
  JWTMiddleware.verifyToken,
  TaskManagementController.getTaskManagementFromCompany,
]);

taskManagementRouter.post("/", [
  JWTMiddleware.verifyToken,
  TaskManagementController.addTaskManagement,
]);

taskManagementRouter.put("/:task_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.updateTaskManagement,
]);

taskManagementRouter.delete("/:task_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.deleteTaskManagement,
]);

export default taskManagementRouter;
