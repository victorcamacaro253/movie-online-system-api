import {Router} from 'express';
import Authentication from '../controllers/authentication.js'
import passport from 'passport';


const router = Router()

router.post('/login',Authentication.login)

router.post('/logout',Authentication.logout)

router.post('/refreshToken',Authentication.refreshToken)


//------------------Google OAuth2.0------------------

router.get('/google',passport.authenticate('google',{scope: ['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/'}),(req,res)=>{
    res.redirect('/profile')
    })


    router.get('/profile',(req,res)=>{
  if(!req.isAuthenticated()){
      return res.redirect('/')
    }
  res.json({
    message: 'User profile',
    user: req.user
})
})

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.redirect('/')
    })
})

export default router;