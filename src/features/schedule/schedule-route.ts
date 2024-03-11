import { Router } from "express";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
import { ScheduleController } from "./schedule-controller";

const scheduleRoute: Router = Router();
scheduleRoute.post("/", [
  JWTMiddleware.verifyToken,
  ScheduleController.addSchedule,
]);

export default scheduleRoute;
