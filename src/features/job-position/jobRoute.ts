import { Router } from "express";
import { JobPositionController } from "./jobController";

const jobPositionRoute: Router = Router();

jobPositionRoute.get('/job-position/:company_branch_id', JobPositionController.getJobPosition);
jobPositionRoute.post('/job-position/', JobPositionController.createJobPosition);

export default jobPositionRoute;