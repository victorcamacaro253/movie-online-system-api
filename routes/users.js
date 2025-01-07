import { Router } from "express";
import User from "../controllers/users.js"
const router = Router()


router.get('/',User.getAllUsers)

router.get('/:id',User.getUserById)

router.get('/username/:username',User.getUserByUsername)

router.get('/email',User.getUserByEmail)

router.get('/ID',User.getUserByPersonalID)

router.get('/active',User.getAactiveUsers)

export default router;