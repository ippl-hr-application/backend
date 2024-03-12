import { Router } from "express";
import { EmploymentController } from "./employmentController";

const employmentRoute: Router = Router();

employmentRoute.get('/employment-statuses/:company_branch_id', EmploymentController.getEmploymentStatus);
employmentRoute.post('/employment-statuses/', EmploymentController.createEmploymentStatus);