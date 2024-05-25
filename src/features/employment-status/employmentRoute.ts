import { Router } from "express";
import { EmploymentController } from "./employmentController";

const employmentRoute: Router = Router();

employmentRoute.get('/:company_branch_id', EmploymentController.getEmploymentStatus);
employmentRoute.post('/', EmploymentController.createEmploymentStatus);
employmentRoute.put('/update', EmploymentController.updateEmploymentStatus);
employmentRoute.delete('/delete', EmploymentController.deleteEmploymentStatus);

export default employmentRoute;