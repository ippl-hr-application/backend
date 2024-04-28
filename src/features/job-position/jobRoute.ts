import { Router } from "express";
import { JobPositionController } from "./jobController";

const jobPositionRoute: Router = Router();

jobPositionRoute.get('/:company_branch_id', JobPositionController.getJobPosition);
jobPositionRoute.post('/', JobPositionController.createJobPosition);
jobPositionRoute.put('/update', JobPositionController.updateJobPosition);

export default jobPositionRoute;