import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { ShiftController } from "./shift-controller";

const scheduleRoute: Router = Router();
scheduleRoute.post("/", [JWTMiddleware.verifyToken, ShiftController.addShift]);
scheduleRoute.delete("/:shift_id", [
  JWTMiddleware.verifyToken,
  ShiftController.deleteShift,
]);
scheduleRoute.put("/:shift_id", [
  JWTMiddleware.verifyToken,
  ShiftController.updateShift,
]);
scheduleRoute.get("/:employee_id", [
  JWTMiddleware.verifyToken,
  ShiftController.getShiftEmployee,
]);
scheduleRoute.get("/", [
  JWTMiddleware.verifyToken,
  ShiftController.getAllshifts,
]);
export default scheduleRoute;
