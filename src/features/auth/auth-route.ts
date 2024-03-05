import { Router } from "express";
import { AuthController } from "./auth-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const authRoute: Router = Router();

authRoute.post("/login", AuthController.login);
authRoute.post("/employee-login", AuthController.employeeLogin);
authRoute.post("/register", AuthController.register);
authRoute.get("/me", [
  JWTMiddleware.verifyToken,
  AuthController.getCurrentLoggedInUser,
]);

export default authRoute;
