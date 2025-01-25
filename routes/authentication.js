import {Router} from 'express';
import Authentication from '../controllers/authentication.js'


const router = Router()

router.post('/login',Authentication.login)

router.post('/logout',Authentication.logout)

router.post('/refreshToken',Authentication.refreshToken)


export default router;