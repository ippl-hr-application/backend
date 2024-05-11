import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { AttendanceManagementController } from "./attendance-management-controller";

const attendanceManagementRoute: Router = Router();

attendanceManagementRoute.get("/", [
  JWTMiddleware.verifyToken,
  AttendanceManagementController.getAllAttendances,
]);

attendanceManagementRoute.get("/:attendance_id", [
  JWTMiddleware.verifyToken,
  AttendanceManagementController.getAttendanceById,
]);

attendanceManagementRoute.put("/:attendance_check_id", [
  JWTMiddleware.verifyToken,
  AttendanceManagementController.updateAttendance,
]);

attendanceManagementRoute.delete("/:attendance_id", [
  JWTMiddleware.verifyToken,
  AttendanceManagementController.deleteAttendance,
]);
export default attendanceManagementRoute;
