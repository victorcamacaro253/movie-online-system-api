import { Router } from "express";
import userPreferences from "../controllers/userPreferences.js";
const router = Router()

router.get("/", userPreferences.getAllUsersPreferences)

router.get('/:id',userPreferences.getUserPreferences)

router.post("/", userPreferences.createUserPreferences)

router.put("/:id", userPreferences.updateUserPreferences)

router.patch("/:id/removeGenre", userPreferences.removeGenre)

router.patch("/:id/removeActor", userPreferences.removeActor)

router.patch("/:id/addGenre", userPreferences.addGenre)

router.patch("/:id/addActor", userPreferences.addActor)



router.delete('/:id',userPreferences.deleteUserPreferences)





export default router

