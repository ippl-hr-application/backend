import { Router } from "express";
import { ProfileController } from "./profile-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";
const profileRoute: Router = Router();

profileRoute.get("/", [
  JWTMiddleware.verifyToken,
  ProfileController.getProfile,
]);

export default profileRoute;
