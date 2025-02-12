import { Router } from "express";
import loginHistory from "../controllers/loginHistory.js";


const router = Router()

router.get('/',loginHistory.getAllLoginRecords)

router.get('/stats', loginHistory.getLoginStats);


router.get('/user/:id',loginHistory.getUserLoginHistory)



router.post('/login',loginHistory.addUserLoginRecord)

router.delete('/:id', loginHistory.deleteLoginRecord);

router.delete('/user/:userId', loginHistory.deleteUserLoginHistory);



export default router