import { Router } from "express";
import UserHistory from "../controllers/userHistory.js";

const router = Router();


router.get('/:userId',UserHistory.getUserHistory)

router.get('/',UserHistory.getAllUsersHistory)

router.get('/totalGross',UserHistory.getTotalGross)




router.get('/:userId/date', UserHistory.getUserHistoryByDate);

//This function creates a user history and if a user already exist ,add a booking 
router.post('/', UserHistory.addUserHistoryRecord);

router.put('/:userId/booking/:bookingId', UserHistory.updateUserHistoryRecord);

router.delete('/:userId/booking/:bookingId',UserHistory.deleteUserHistoryBookingRecord);



export default router