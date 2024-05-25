import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { AttendanceController } from "./attendance-controllers";
import { upload } from "../../middlewares/multer";

const attendanceRoute: Router = Router();

attendanceRoute.get("/", [
  JWTMiddleware.verifyToken,
  AttendanceController.getShiftInfo,
]);
attendanceRoute.post("/check-in", [
  JWTMiddleware.verifyToken,
  upload.single("attendance_file"),
  AttendanceController.checkIn,
]);
attendanceRoute.post("/check-out", [
  JWTMiddleware.verifyToken,
  upload.single("attendance_file"),
  AttendanceController.checkOut,
]);
attendanceRoute.get("/today", [
  JWTMiddleware.verifyToken,
  AttendanceController.getToday,
]);
attendanceRoute.get("/recap", [
  JWTMiddleware.verifyToken,
  AttendanceController.getRecap,
]);
attendanceRoute.get("/history", [
  JWTMiddleware.verifyToken,
  AttendanceController.getHistoryAttendance,
]);
export default attendanceRoute;
