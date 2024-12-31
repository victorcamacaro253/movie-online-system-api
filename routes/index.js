import { Router } from "express";
import movies from "./movies.js";
import actors from "./actors.js";
import company from "./company.js";
import theaters from "./theaters.js";

const router= Router()

router.use('/movies',movies)

router.use('/actors',actors)

router.use('/company',company)

router.use('/theaters',theaters)


export default router;