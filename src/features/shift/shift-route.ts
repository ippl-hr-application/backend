import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { ShiftController } from "./shift-controller";

const shiftRoute: Router = Router();
shiftRoute.post("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  ShiftController.addShift,
]);
shiftRoute.delete("/:shift_id", [
  JWTMiddleware.verifyToken,
  ShiftController.deleteShift,
]);
shiftRoute.get("/:company_branch_id", [
  JWTMiddleware.verifyToken,
  ShiftController.getAllshifts,
]);
shiftRoute.post("/assign-shift/:company_branch_id", [
  JWTMiddleware.verifyToken,
  ShiftController.addAssignShift,
]);
shiftRoute.get("/assign-shift/:company_branch_id", [
  JWTMiddleware.verifyToken,
  ShiftController.getAllAssignShifts,
]);
shiftRoute.put("/assign-shift/:company_branch_id/:employee_id", [
  JWTMiddleware.verifyToken,
  ShiftController.updateAssignShift,
]);

export default shiftRoute;
