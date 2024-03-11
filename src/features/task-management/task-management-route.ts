import { Router } from "express";
import { TaskManagementController } from "./task-management-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
const taskManagementRouter: Router = Router();

taskManagementRouter.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  TaskManagementController.getTaskManagementFromCompany,
]);

taskManagementRouter.post("/", TaskManagementController.addTaskManagement);

export default taskManagementRouter;