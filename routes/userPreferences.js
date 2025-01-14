import { Router } from "express";
import userPreferences from "../controllers/userPreferences.js";
const router = Router()

router.get("/", userPreferences.getAllUsersPreferences)

//router.get('/:id',userPreferences.getUserPreferencesByUserId)

//router.post("/", userPreferences.postUserPreferences)

//router.put("/:id", userPreferences.putUserPreferences)





export default router

