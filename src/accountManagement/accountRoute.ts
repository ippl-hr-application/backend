import { Router } from "express";
import { AccountController } from "./accountController";
import { JWTMiddleware } from "../middlewares/jwt_middleware";

const accountRoute = Router();

// Get all employees
accountRoute.get('/employees', AccountController.Employees);
// Create a new employee
accountRoute.post('/employees', AccountController.createEmployee);