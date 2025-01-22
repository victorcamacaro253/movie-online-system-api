import { Router } from "express";
import Booking from "../controllers/bookings.js";

const router = Router()

router.get('/',Booking.getBooking)

router.post('/',Booking.createBooking)


export default router;  