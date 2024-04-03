import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/branch/:company_branch_id/employees', AccountController.getAllEmployees);
accountRoute.get('/branch/:company_branch_id/employee/:employee_id', AccountController.getEmployee);
// Create a new employee
accountRoute.post('/create', AccountController.createEmployee);
// Update an employee
accountRoute.patch('/update', AccountController.updateEmployee);
accountRoute.patch('/resigned', AccountController.employeeResign)
// accountRoute.patch('/branch/:company_branch_id/employee/:employee_id', AccountController.softDeleteEmployee);
// Delete an employee
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id', AccountController.deleteEmployee);

export default accountRoute;