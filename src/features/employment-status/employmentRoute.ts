import { Router } from "express";
import { EmploymentController } from "./employmentController";

const employmentRoute: Router = Router();

employmentRoute.get('/employment-status/:company_branch_id', EmploymentController.getEmploymentStatus);
employmentRoute.post('/employment-status/', EmploymentController.createEmploymentStatus);

export default employmentRoute;