import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/employees/:company_branch_id', AccountController.getAllEmployees);
// Create a new employee
accountRoute.post('/employees/', AccountController.createEmployee);
// Update an employee use params
// accountRoute.patch('/employees/:company_branch_id/:employee_id', AccountController.updateEmployee);

// Update an employee use body
accountRoute.patch('/employees/', AccountController.updateEmployee);
// Delete an employee
accountRoute.delete('/employees/:company_branch_id/:employee_id', AccountController.deleteEmployee);

accountRoute.get('/job-positions/:company_branch_id', AccountController.getJobPositions);

accountRoute.post('/job-positions/', AccountController.createJobPosition);

accountRoute.get('/employment-statuses/:company_branch_id', AccountController.getEmploymentStatus);

accountRoute.post('/employment-statuses/', AccountController.createEmploymentStatus);

export default accountRoute;