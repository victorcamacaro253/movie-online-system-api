import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GitHubStrategy } from 'passport-github2';

import userModel from '../models/users.js';

import dotenv from 'dotenv';



dotenv.config();


//------------------Google OAuth2.0------------------

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:5000/authentication/google/callback',
},
async (accessToken, refreshToken, profile, done)=>{

    try{
console.log(profile)
        let rows = await userModel.findOne({google_id : profile.id})
console.log(rows)
        if(rows){
            console.log('user exists')
            return done(null,rows)
        }else{
            const newUser = {
                username: profile.displayName,
                email: profile.emails[0].value,
                profile_image: profile.photos[0].value,
                google_id: profile.id,

            }
//console.log(newUser)
            let user = await userModel.create(newUser)
            console.log(user)
            return done(null,user)
        }
    }catch(error){
        console.log(error)
        return done(error)
    }

}))



//---------------------------- Facebook Oauth 2.0 -------------------------------------------------------
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/authentication/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let rows = await userModel.findOne({ facebook_id: profile.id }); // Changed google_id to facebookId
        console.log(rows);
        if(rows) {
            console.log('User  exists');
            return done(null,rows);
        } else {
            const newUser  = {
                username: profile.displayName,
                email: profile.emails[0].value,
                profile_image: profile.photos[0].value,
                facebook_id: profile.id,
            };
            console.log(newUser );

            let user = await userModel.create(newUser);
            console.log(user);
            return done(null, user);
        }
    } catch (error) {
        console.log(error);
        return done(error);
    }
}));


//--------------------------------------Twitter Oauth 2.0---------------------------------------------------



passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:5000/authentication/twitter/callback',
    includeEmail: true 
  },
    async (token, tokenSecret, profile, done) => {
      console.log(profile)
      try {
        let user = await userModel.findOne({ twitter_id: profile.id }); // Changed google_id to facebookId
  
        if(user){
  
          return done(null,user)
  
          }else{
              
            const newUser = {
              twitter_id: profile.id,
              username: profile.displayName,
              email: profile.emails ? profile.emails[0].value : null,
              image: profile.photos[0].value,
              }
               user = await userModel.create(newUser);
              console.log(user)
              return done(null,user)
            }
      } catch (error) {
        return done(error,null)
        
      }
      }
    ))


//----------------------------------------------Github Oauth2.0---------------------------------------------------------------

passport.use(new GitHubStrategy({
    clientID : process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/authentication/github/callback',
    scope:['user:email'],
  
  },
  async (accessToken,refreshToken,profile,done)=>{
    console.log(profile)
    try {
        let user = await userModel.findOne({ github_id: profile.id }); // Changed google_id to facebookId

        if(user){
        return done(null,user)
      }else{
        const email= (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null 
  
        const newUser = {
          github_id: profile.id,
          username: profile.displayName,
          email: email,
          image: profile.photos[0].value,
        }
  
        user = await userModel.create(newUser);
        console.log(user)
        return done(null,user)
      }
    } catch (error) {
      return done(error,null)
    }
  }
  ))

//----------------------------------------------------------------------------------------------------------------
passport.serializeUser((user,done)=>done(null,user));


passport.deserializeUser(async (user,done)=>{
try {
    done(null,user)
} catch (err) {
    done(err,null)
}
})