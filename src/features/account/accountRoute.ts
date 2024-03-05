import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute = Router();

// Get all employees
accountRoute.get('/employees', AccountController.getAllEmployees);
// Create a new employee
accountRoute.post('/employees', AccountController.createEmployee);

export default accountRoute;