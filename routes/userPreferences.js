import { Router } from "express";
import userPreferences from "../controllers/userPreferences.js";
const router = Router()

router.get("/", userPreferences.getAllUsersPreferences)

router.get('/:id',userPreferences.getUserPreferences)

router.post("/", userPreferences.createUserPreferences)

router.post("/addGenre/:id", userPreferences.addGenre)

router.post("/addActor/:id", userPreferences.addActor)


router.put("/:id", userPreferences.updateUserPreferences)

router.patch("/:id/removeGenre", userPreferences.removeGenre)

router.patch("/:id/removeActor", userPreferences.removeActor)





router.delete('/:id',userPreferences.deleteUserPreferences)





export default router

