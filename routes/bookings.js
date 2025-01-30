import { Router } from "express";
import Booking from "../controllers/bookings.js";

const router = Router()

router.get('/',Booking.getBooking)

router.get('/user/:userId',Booking.getBookingsByUserId)


router.get('/:id',Booking.getBookingById)


router.post('/',Booking.createBooking)

router.post('/bookSeat',Booking.bookSeat)


export default router;  