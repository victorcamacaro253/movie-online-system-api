import { Router } from "express";
import loginHistory from "../controllers/loginHistory";


const router = Router()

router.get('/login',loginHistory.addUserLoginRecord)



export default router