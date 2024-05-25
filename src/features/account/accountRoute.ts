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
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.createEmployee
]);
accountRoute.post('/:company_branch_id/create', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.createEmployee,
]);

// Update an employee
accountRoute.patch('/update', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.updateEmployee
]);
accountRoute.patch('/:company_branch_id/update', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.updateEmployee,
]);

// Update an employee that has resigned
accountRoute.patch('/resigned', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.employeeResign
]);
accountRoute.patch('/:company_branch_id/resigned', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.employeeResign,
]);

// soft Delete an employee, set deleted_at to current date and still keep the data
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id/softDelete', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.softDeleteEmployee,
]);

// Literally Delete from database
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id/deletePermanent', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.deleteEmployeeFromDatabase,
]);
export default accountRoute;
