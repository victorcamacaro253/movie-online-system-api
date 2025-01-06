import { Router } from "express";
import ShowtimeController from "../controllers/showtimes.js";
const router = Router();

router.get("/", ShowtimeController.getAllShowtimes);

router.get('/theater/:theater_id/date/:date', ShowtimeController.getShowtimesByTheaterAndDate);

// Get showtimes filtered by status
router.get('/status', ShowtimeController.getShowtimesByStatus);

router.get('/date/:date',ShowtimeController.getShowtimesByDate)

router.get('/theater/:theater_id',ShowtimeController.getShowtimesByTheater)

router.get('/auditoriums/:auditorium_id',ShowtimeController.getShowtimesByAuditorium)

router.get('/showtimes/date-range/:start_date/:end_date', ShowtimeController.getShowtimesByDateRange);


router.get("/:id", ShowtimeController.getShowtimeById);

router.post("/", ShowtimeController.createShowtime);


/*


router.put("/:id", Showtime.updateShowtime);

router.delete("/:id", Showtime.deleteShowtime);
*/

export default router;