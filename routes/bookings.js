import { Router } from "express";
import Booking from "../controllers/bookings.js";

const router = Router()

router.get('/',Booking.getBooking)

router.get('/user/:userId',Booking.getBookingsByUserId)

router.get('/grossed',Booking.getTotalGrossed)

router.get('/grossed-by-movie',Booking.getGrossedByMovie)

router.get('/grossed-by-theater',Booking.getGrossedByTheater)

router.get('/groosed-by-city',Booking.getGrossedByCity)


router.get('/:id',Booking.getBookingById)


router.post('/',Booking.createBooking)

router.post('/bookSeat',Booking.bookSeat)


export default router;  