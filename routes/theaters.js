import {Router} from "express"
import Theater from "../controllers/theaters.js"
const router= Router()


router.get('/',Theater.getAllTheaters)

router.get('/page',Theater.getPagedTheaters)

router.get('/:id',Theater.getTheaterById)


router.get('/name/:name',Theater.getTheaterByName)

router.get('/city/:city',Theater.getTheatersByCity)

router.post('/',Theater.createTheater)

router.put('/:id',Theater.updateTheater)

router.delete('/:id',Theater.deleteTheater)

export default router