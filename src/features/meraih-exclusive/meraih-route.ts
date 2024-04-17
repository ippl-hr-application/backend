import { Router } from "express";
import { MeraihController } from "./meraih-controller";
import { JWTMiddleware } from "../../middlewares/jwt_middleware";

const meraihRoutes: Router = Router();

meraihRoutes.get("/registered-users", MeraihController.getAllRegisteredUsers);

meraihRoutes.put(
  "/update-package-type/:company_id",
  MeraihController.updateCompanyPackageType
);
export default meraihRoutes;
