import { Router } from "express";
import { CompanyController } from "./company-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const companyRoute = Router();

companyRoute.get("/head", [
  JWTMiddleware.verifyToken,
  CompanyController.getCompany
]);

companyRoute.put("/edit", [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerOnly,
  CompanyController.editCompany
]);

export default companyRoute;