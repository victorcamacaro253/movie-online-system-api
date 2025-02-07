import { Router } from "express";
import User from "../controllers/users.js"
import uploadUser from "../middleware/multerUser.js";
import authenticationToken from "../middleware/authenticationToken.js";
const router = Router()


router.get('/',authenticationToken,User.getAllUsers)

router.get('/:id',User.getUserById)

router.get('/username/:username',User.getUserByUsername)

router.get('/email',User.getUserByEmail)

router.get('/ID',User.getUserByPersonalID)

router.get('/active',User.getAactiveUsers)

router.post('/',uploadUser.single('profile_image'),User.createUser)

router.post('/multiple',uploadUser.array('profile_image'),User.createUsers)

export default router;