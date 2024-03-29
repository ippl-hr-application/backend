import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { ShiftController } from "./shift-controller";

const shiftRoute: Router = Router();
shiftRoute.post("/", [JWTMiddleware.verifyToken, ShiftController.addShift]);
shiftRoute.delete("/:shift_id", [
  JWTMiddleware.verifyToken,
  ShiftController.deleteShift,
]);
shiftRoute.put("/:shift_id", [
  JWTMiddleware.verifyToken,
  ShiftController.updateShift,
]);
shiftRoute.get("/:employee_id", [
  JWTMiddleware.verifyToken,
  ShiftController.getShiftEmployee,
]);
shiftRoute.get("/", [JWTMiddleware.verifyToken, ShiftController.getAllshifts]);
export default shiftRoute;
