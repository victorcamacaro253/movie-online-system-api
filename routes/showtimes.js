import { Router } from "express";
import ShowtimeController from "../controllers/showtimes.js";
const router = Router();

router.get("/", ShowtimeController.getAllShowtimes);

router.get('/theater/:theater_id/date/:date', ShowtimeController.getShowtimesByTheaterAndDate);

router.get("/:id", ShowtimeController.getShowtimeById);

router.post("/", ShowtimeController.createShowtime);


/*


router.put("/:id", Showtime.updateShowtime);

router.delete("/:id", Showtime.deleteShowtime);
*/

export default router;