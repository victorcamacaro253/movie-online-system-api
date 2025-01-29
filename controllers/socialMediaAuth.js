import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import userModel from '../models/users.js';

import dotenv from 'dotenv';


dotenv.config();


//------------------Google OAuth2.0------------------

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:5000/auth/google/callback',
},
async (accessToken, refreshToken, profile, done)=>{

    try{

        let rows = await userModel.findOne({_id : profile.id})
console.log(rows)
        if(rows){
            console.log('user exists')
            return done(null,rows)
        }else{
            const newUser = {
                _id: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                profile_image: profile.photos[0].value,
                googleId: profile.id,

            }

            let user = await userModel.create(newUser)
            console.log(user)
            return done(null,user)
        }
    }catch(error){
        console.log(error)
        return done(error)
    }

}))