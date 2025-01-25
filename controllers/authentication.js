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
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict', // Protección contra CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day,
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


    static async logout(req,res){
        try {   

            console.log(req.cookie)
           /* if(!req.cookies.refreshToken){
                return res.status(400).json({message: 'No refresh token provided'})
            }*/
            
            const refreshToken = req.cookies.refreshToken

            if(!refreshToken){
                return res.status(400).json({message: 'No refresh token provided'})
            }

            const decoded = tokenService.verifyToken(refreshToken)
            if(!decoded){
                return res.status(400).json({message: 'Invalid or expired refresh token'})
            }

            await refreshTokens.findOneAndDelete({token: refreshToken})


         res.clearCookie('refreshToken', {
         httpOnly: true,  // Asegura que la cookie no pueda ser accesible por JavaScript
        secure: process.env.NODE_ENV === 'production',  // Solo en producción si usas HTTPS
          sameSite: 'Strict',  // Protege contra ataques CSRF
          path:'/'
          });

            res.status(200).json({message: 'Logout successfull'})

        } catch (error) {
            handleError(res,error)
            
        }
    }


    
//Funcion para generar un nuevo access token con el refreshToken
static refreshToken = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(400).json({error:'No refresh token provided'})
        }
        try {
            const decoded = tokenService.verifyToken(refreshToken)
            if(!decoded){
                return res.status(403).json({error:'Invalid or expired refresh token'})
                }

console.log(decoded)
                const user= await userModel.getUserById(decoded.id)
                if(!user || user.length===0){
                    return res.status(404).json({error:'User not found'})
                    }


              const tokenRecord= await tokenModel.verifyExistingToken(refreshToken,decoded.id)

               // Verificar si el token está revocado
               if (!tokenRecord || tokenRecord.length === 0 ) {
                return res.status(403).json({ error: 'Invalid or revoked refresh token' });
            }
    


                    const newAccessToken = tokenService.generateToken(decoded._id,decoded.email,user.rol,'1h')
                    
                    
                        res.json({ 
                            accessToken: newAccessToken
                        })
                        } catch (error) {
                           handleError(res,error)
                            }
                        }
    

}


export default Authentication;