import AdminManager from "../controllers/adminManager.js";
import { Router } from "express";

const router = Router();

router.get("/admin", AdminManager.getAllAdmin);

router.get("/manager", AdminManager.getAllManagers);


router.get("/admin/:id", AdminManager.getAdminById);

router.get("/manager/:id", AdminManager.getManagerById);


router.post("/admin", AdminManager.createAdminManager);

router.post("/manager", AdminManager.createAdminManager);


router.delete("/admin/:id", AdminManager.deleteAdmin);


router.delete("/manager/:id", AdminManager.deleteManager);


export default router;