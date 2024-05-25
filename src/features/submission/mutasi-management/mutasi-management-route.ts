import { Router } from "express";
import { JWTMiddleware } from "../../../middlewares/jwt_middleware";
import { MutasiManagementController } from "./mutasi-management-controller";
const mutasiManagementRoute: Router = Router();

mutasiManagementRoute.get("/:company_branch_id/all", [
  JWTMiddleware.verifyToken,
  MutasiManagementController.getAllByCompanyBranchId,
]);

mutasiManagementRoute.get("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  MutasiManagementController.getById,
]);

mutasiManagementRoute.put("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  MutasiManagementController.validateLetter,
]);
mutasiManagementRoute.delete("/:company_branch_id/:submission_id", [
  JWTMiddleware.verifyToken,
  MutasiManagementController.deleteLetter,
]);
export default mutasiManagementRoute;
