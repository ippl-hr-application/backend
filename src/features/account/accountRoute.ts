import { Router } from 'express';
import { AccountController } from './accountController';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';
import { CompanyMiddleware } from '../../middlewares/company_middleware';

const accountRoute: Router = Router();

// Get all employees
accountRoute.get('/branch/:company_branch_id/employees', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  AccountController.getAllEmployees,
]);
accountRoute.get('/branch/:company_branch_id/employee/:employee_id', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  AccountController.getEmployee,
]);

// Create a new employee
accountRoute.post('/create', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.createEmployee
]);
accountRoute.post('/:company_branch_id/create', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.createEmployee,
]);

// Update an employee
accountRoute.patch('/update', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.updateEmployee
]);
accountRoute.patch('/:company_branch_id/update', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.updateEmployee,
]);

// Update an employee that has resigned
accountRoute.patch('/resigned', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.employeeResign
]);
accountRoute.patch('/:company_branch_id/resigned', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.employeeResign,
]);

// soft Delete an employee, set deleted_at to current date and still keep the data
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id/softDelete', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.softDeleteEmployee,
]);

// Literally Delete from database
accountRoute.delete('/branch/:company_branch_id/employee/:employee_id/deletePermanent', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  JWTMiddleware.ownerAndManagerOnly,
  AccountController.deleteEmployeeFromDatabase,
]);
export default accountRoute;
