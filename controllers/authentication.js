import userModel from '../models/users.js';
import {compare} from 'bcrypt';
import { randomBytes } from "crypto";
import tokenService from '../services/tokenService.js';
import loginHistory from './loginHistory.js';
import handleError from '../utils/handleError.js';
import refreshTokens from '../models/refresh_tokens.js';




class Authentication {

    static async login (req,res){
        const { identifier, password } = req.body;

        console.log(identifier,password)

        try {
            const user = await userModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier }
                    ],
            })



            if(!user){
                return res.status(401).json({ message: 'User not found' });
            }

           const match = await compare(password,user.password)

           if(!match){
            return res.status(401).json({ message: 'Invalid password' });
           }

           const token =  tokenService.generateToken(user._id,user.email,'1h')

           const refreshToken = tokenService.generateToken(user._id,user.email,'7d') 

           const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // Expira en 7 días

           const saveRefreshToken= new refreshTokens({
             user_id: user._id,
              token: refreshToken,
               expiresIn: expiresAt })

               await saveRefreshToken.save()



           res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: process.env.NODE.ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
           })

           const randomCode = randomBytes(8).toString('hex')

           loginHistory.addUserLoginRecord(req,user._id,randomCode)

           res.status(200).json({
            message: "Login successfull",
            token: token,
            refreshToken: refreshToken
           })




        } catch (error) {
            handleError(res,error)
            
        }
    }

}


export default Authentication;