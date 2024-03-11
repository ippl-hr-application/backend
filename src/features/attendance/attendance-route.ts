import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { AttendanceController } from "./attendance-controllers";

const attendanceRoute: Router = Router();

attendanceRoute.get("/", [
  JWTMiddleware.verifyToken,
  AttendanceController.getShiftInfo,
]);
export default attendanceRoute;
