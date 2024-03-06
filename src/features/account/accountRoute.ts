import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute = Router();

// Get all employees
accountRoute.get('/employees/:company_branch_id', AccountController.getAllEmployees);
// Create a new employee
accountRoute.post('/employees', AccountController.createEmployee);
// Update an employee
accountRoute.patch('/employees/:id', AccountController.updateEmployee);
// Delete an employee
accountRoute.delete('/employees/:id', AccountController.deleteEmployee);
export default accountRoute;