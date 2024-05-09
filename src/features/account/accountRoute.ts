import { Router } from 'express';
import { AccountController } from './accountController';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/branch/:company_branch_id/employees', [
  JWTMiddleware.verifyToken,
  AccountController.getAllEmployees,
]);
accountRoute.get('/branch/:company_branch_id/employee/:employee_id', [
  JWTMiddleware.verifyToken,
  AccountController.getEmployee,
]);

// Create a new employee
accountRoute.post('/create', [
  JWTMiddleware.verifyToken,
  AccountController.createEmployee
]);
accountRoute.post('/:company_branch_id/create', [
  JWTMiddleware.verifyToken,
  AccountController.createEmployee,
]);

// Update an employee
accountRoute.patch('/update', [
  JWTMiddleware.verifyToken,
  AccountController.updateEmployee
]);
accountRoute.patch('/:company_branch_id/update', [
  JWTMiddleware.verifyToken,
  AccountController.updateEmployee,
]);

// Update an employee that has resigned
accountRoute.patch('/resigned', [
  JWTMiddleware.verifyToken,
  AccountController.employeeResign
]);
accountRoute.patch('/:company_branch_id/resigned', [
  JWTMiddleware.verifyToken,
  AccountController.employeeResign,
]);
// accountRoute.patch('/branch/:company_branch_id/employee/:employee_id', AccountController.softDeleteEmployee);

// Delete an employee
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id', [
  JWTMiddleware.verifyToken,
  AccountController.deleteEmployee,
]);

export default accountRoute;
