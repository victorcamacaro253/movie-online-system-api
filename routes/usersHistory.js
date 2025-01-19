import { Router } from "express";
import UserHistory from "../controllers/userHistory.js";

const router = Router();

router.get('/',UserHistory.getAllUsersHistory)


export default router