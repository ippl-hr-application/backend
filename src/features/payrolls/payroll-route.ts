import { Router } from "express";
import { PayrollController } from "./payroll-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const payrollRouter: Router = Router();

payrollRouter.get("/", [
  JWTMiddleware.verifyToken,
  PayrollController.getPayrolls,
]);

payrollRouter.get("/employee", [
  JWTMiddleware.verifyToken,
  PayrollController.getUserPayrolls,
])

payrollRouter.post("/", [
  JWTMiddleware.verifyToken,
  PayrollController.createPayroll,
]);

payrollRouter.put("/:payroll_id", [
  JWTMiddleware.verifyToken,
  PayrollController.updatePayroll,
]);

payrollRouter.delete("/:payroll_id", [
  JWTMiddleware.verifyToken,
  PayrollController.deletePayroll,
]);

export default payrollRouter;
