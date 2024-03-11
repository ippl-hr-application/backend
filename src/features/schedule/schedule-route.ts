import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { ScheduleController } from "./schedule-controller";

const scheduleRoute: Router = Router();
scheduleRoute.post("/", [
  JWTMiddleware.verifyToken,
  ScheduleController.addSchedule,
]);
scheduleRoute.delete("/:schedule_id", [
  JWTMiddleware.verifyToken,
  ScheduleController.deleteSchedule,
]);
scheduleRoute.put("/:schedule_id", [
  JWTMiddleware.verifyToken,
  ScheduleController.updateSchedule,
]);
scheduleRoute.get("/:schedule_id", [
  JWTMiddleware.verifyToken,
  ScheduleController.getDetailSchedule,
]);
scheduleRoute.get("/", [
  JWTMiddleware.verifyToken,
  ScheduleController.getAllSchedules,
]);
export default scheduleRoute;
