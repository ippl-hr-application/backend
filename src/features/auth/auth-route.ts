import { Router } from "express";
import { AuthController } from "./auth-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const authRoute: Router = Router();

authRoute.post("/login", AuthController.login);
authRoute.post("/manager-login", AuthController.employeeManagerLogin);
authRoute.post("/employee-login", AuthController.employeeLogin);
authRoute.post("/register", AuthController.register);
authRoute.get("/me", [
  JWTMiddleware.verifyToken,
  AuthController.getCurrentLoggedInUser,
]);
authRoute.get("/forgot-password", AuthController.ownerForgotPassword);
authRoute.post("/reset-password", AuthController.resetPassword);
authRoute.get("/employee-forgot-password", AuthController.employeeForgotPassword);
authRoute.post("/employee-reset-password", AuthController.employeeResetPassword);

export default authRoute;
