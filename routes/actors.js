import { Router } from "express";
import Actors from '../controllers/actors.js'
import uploadActor from "../middleware/multerActor.js";

const router = Router()

router.get('/',Actors.getAllActors)

router.get('/actor/:name',Actors.getActorByName)

router.get('/:id',Actors.getActorById)

router.post('/',uploadActor.single('image'),Actors.createActor)

router.post('/addMultiple',Actors.addMultipleActors)

router.put('/:id',Actors.updateActor)


router.delete('/',Actors.deleteActor)



export default router;