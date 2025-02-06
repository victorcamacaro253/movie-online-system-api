import AdminManager from "../controllers/adminManager.js";
import { Router } from "express";

const router = Router();

router.get("/admin", AdminManager.getAllAdmin);

router.get("/manager", AdminManager.getAllManagers);

router.post("/admin", AdminManager.createAdminManager);

router.post("/manager", AdminManager.createAdminManager);



export default router;