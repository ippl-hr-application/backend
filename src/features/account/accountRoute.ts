import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/branch/:company_branch_id', AccountController.getAllEmployees);
accountRoute.get('/branch/:company_branch_id/employee/:employee_id', AccountController.getEmployee);
// Create a new employee
accountRoute.post('/', AccountController.createEmployee);
// Update an employee use params
// accountRoute.patch('/branch/:company_branch_id/:employee_id', AccountController.updateEmployee);
// Update an employee use body
accountRoute.patch('/', AccountController.updateEmployee);
// Delete an employee
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id', AccountController.deleteEmployee);

export default accountRoute;