import { Router } from "express";
import User from "../controllers/users.js"
import uploadUser from "../middleware/multerUser.js";
import authenticationToken from "../middleware/authenticationToken.js";
const router = Router()


router.get('/',User.getAllUsers)


router.get('/active',User.getActiveUsers)


router.get('/pagination',User.getPaginatedUsers)


router.get('/email',User.getUserByEmail)


router.get('/:id',User.getUserById)

router.get('/username/:username',User.getUserByUsername)


router.get('/ID',User.getUserByPersonalID)



router.post('/',uploadUser.single('profile_image'),User.createUser)

router.post('/multiple',uploadUser.array('profile_image'),User.createUsers)

export default router;