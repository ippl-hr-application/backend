import { Router } from "express";
import { AccountController } from "./accountController";

const accountRoute: Router = Router();

// employees
accountRoute.get('/employees/:company_branch_id', AccountController.getAllEmployees);
accountRoute.post('/employees/', AccountController.createEmployee);
// accountRoute.patch('/employees/:company_branch_id/:employee_id', AccountController.updateEmployee);
accountRoute.patch('/employees/', AccountController.updateEmployee);
accountRoute.delete('/employees/:company_branch_id/:employee_id', AccountController.deleteEmployee);

export default accountRoute;