import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/branch/:company_branch_id/employee', AccountController.getAllEmployees);
accountRoute.get('/branch/:company_branch_id/employee/:employee_id', AccountController.getEmployee);
// Get all employee by resigned status
// accountRoute.get('/branch/:company_branch_id/employee?hasResigned', AccountController.getEmployeesByResignedStatus)
// Create a new employee
accountRoute.post('/', AccountController.createEmployee);
// Update an employee
accountRoute.patch('/', AccountController.updateEmployee);
accountRoute.patch('/resigned', AccountController.employeeResign)
// accountRoute.patch('/branch/:company_branch_id/employee/:employee_id', AccountController.softDeleteEmployee);
// Delete an employee
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id', AccountController.deleteEmployee);

export default accountRoute;