import { Router } from "express";
import { companyBranchRoute } from "./company-branch";
import { companyRoute } from "./company";

const companyManagementRoute = Router();

companyManagementRoute.use("/", companyRoute);
companyManagementRoute.use("/branch", companyBranchRoute);

export default companyManagementRoute;
