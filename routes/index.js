import { Router } from "express";
import movies from "./movies.js";
import actors from "./actors.js";
import company from "./company.js";
import theaters from "./theaters.js";
import showtimes from "./showtimes.js";
import Auditorium from "./auditoriums.js";
import users from "./users.js";

const router= Router()

router.use('/movies',movies)

router.use('/actors',actors)

router.use('/company',company)

router.use('/theaters',theaters)

router.use('/showtimes',showtimes)

router.use('/auditoriums',Auditorium)

router.use('/users',users)


export default router;