import { Router } from "express";
import { MeraihController } from "./meraih-controller";

const meraihRoutes: Router = Router();

meraihRoutes.get("/registered-users", MeraihController.getAllRegisteredUsers);

export default meraihRoutes;