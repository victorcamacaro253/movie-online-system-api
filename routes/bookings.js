import { Router } from "express";
import Booking from "../controllers/bookings.js";

const router = Router()

router.get('/',Booking.getBooking)


router.get('/grossedByCity/:city',Booking.getGrossedByCity)

router.get('/grossedByMovie/:movieTitle',Booking.getGrossedByMovieTitle)

router.get('/grossedByTheater/:theaterName',Booking.getGrossedByTheater)






router.get('/user/:userId',Booking.getBookingsByUserId)


router.get('/:id',Booking.getBookingById)

router.get('/grossed',Booking.getTotalGrossed)


router.post('/',Booking.createBooking)

router.post('/bookSeat',Booking.bookSeat)


export default router;  