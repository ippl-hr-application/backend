import { Router } from "express";
import { AuthController } from "./auth-controller";

const authRoute: Router = Router();

authRoute.post("/login", AuthController.login);

export default authRoute;
