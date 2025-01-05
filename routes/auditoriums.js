import { Router } from "express";
import Auditorium from '../controllers/auditoriums.js'

const router = Router()

router.get('/',Auditorium.getAllAuditoriums)

router.get('/theater/:theaterId',Auditorium.getAuditoriumsByTheater)


router.get('/:id',Auditorium.getAuditoriumById)



router.post('/',Auditorium.createAuditorium)

router.put('/:id',Auditorium.updateAuditorium)


router.delete('/',Auditorium.deleteAuditorium)



export default router;
