import {Router} from 'express';
import Authentication from '../controllers/authentication.js'
import passport from 'passport';


const router = Router()

router.post('/login',Authentication.login)

router.post('/logout',Authentication.logout)

router.post('/refreshToken',Authentication.refreshToken)

// OTP verification endpoint
router.post('/verify-otp', Authentication.verifyOtp);


//------------------Google OAuth2.0------------------------------------------------------------------

router.get('/google',passport.authenticate('google',{scope: ['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/'}),(req,res)=>{
    res.redirect('/authentication/profile')
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





//------------------------ Facebook OAuth2.0---------------------------------------------------------

router.get('/facebook',passport.authenticate('facebook',{scope:['email']}))

router.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/'}),
(req,res)=>{
  res.redirect('/authentication/profile')
  }
  )




  //-------------------------- Twitter OAuth2.0---------------------------------------------------------


  
// Ruta para iniciar sesión con Twitter
router.get('/twitter', passport.authenticate('twitter'));

// Ruta de callback de Twitter
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige al usuario a su perfil o a donde necesites
    res.redirect('/authentication/profile');
  }
);



//---------------Github OAuth2.0---------------------------------------------------------


router.get('/github',passport.authenticate('github',{scope:['user:email']}))

router.get('/github/callback',passport.authenticate('github',{failureRedirect:'/'}),
(req,res)=>{

  res.redirect('/authentication/profile')
  
}
)


export default router;