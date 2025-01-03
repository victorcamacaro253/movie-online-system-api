import { Router } from "express";
import ShowtimeController from "../controllers/showtimes.js";
const router = Router();

router.get("/", ShowtimeController.getAllShowtimes);

/*
router.get("/:id", Showtime.getShowtimeById);

router.post("/", Showtime.createShowtime);

router.put("/:id", Showtime.updateShowtime);

router.delete("/:id", Showtime.deleteShowtime);
*/

export default router;