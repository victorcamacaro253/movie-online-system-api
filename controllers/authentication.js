import userModel from '../models/users.js';
import {compare} from 'bcrypt';
import { randomBytes } from "crypto";
import tokenService from '../services/tokenService.js';
import loginHistory from './loginHistory.js';
import handleError from '../utils/handleError.js';
import refreshTokens from '../models/refresh_tokens.js';
import otpUtils from '../utils/otpUtils.js';





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




        // Check if 2FA is enabled for the user
     /*   if (user.isTwoFactorEnabled) {
            // Generate and send OTP
            const { otp, secret, expiresAt } = await otpUtils.generateAndSendOtp(user.phoneNumber);

            // Save the OTP details in the database
            await userModel.findByIdAndUpdate(user._id, {
                otp,
                otpSecret: secret,
                otpExpiresAt: expiresAt,
            });

            // Respond with a message indicating that an OTP has been sent
            return res.status(200).json({
                message: 'OTP sent successfully',
                userId: user._id,
            });
        }*/

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
               // const user= await userModel.getUserById(decoded.id)
                const user= await userModel.findById(decoded._id)
                if(!user || user.length===0){
                    return res.status(404).json({error:'User not found'})
                    }


             // const tokenRecord= await tokenModel.verifyExistingToken(refreshToken,decoded.id)
               const tokenRecord= await refreshTokens.findOne({token: refreshToken, user_id: decoded._id})

               // Verificar if token is revoked
               if (!tokenRecord || tokenRecord.length === 0 ) {
                return res.status(403).json({ error: 'Invalid or revoked refresh token' });
                }
    


                    const newAccessToken = tokenService.generateToken(decoded._id,decoded.email,'1h')
                    
                    
                        res.json({ 
                            accessToken: newAccessToken
                        })
                        } catch (error) {
                           handleError(res,error)
                            }
                        }



                        static async verifyOtp(req, res) {
                            const { userId, otp } = req.body;
                            try {
                                // Fetch the user from the database
                                const user = await userModel.findById(userId);
                                if (!user || !user.otp || !user.otpSecret || !user.otpExpiresAt) {
                                    return res.status(400).json({ message: 'OTP not found or expired' });
                                }
                        
                                // Verify the OTP
                                const isValid = otpUtils.verifyOtp(otp, user.otpSecret, user.otpExpiresAt);
                                if (!isValid) {
                                    return res.status(400).json({ message: 'Invalid OTP' });
                                }
                        
                                // Clear the OTP details from the database
                                await userModel.findByIdAndUpdate(userId, {
                                    otp: null,
                                    otpSecret: null,
                                    otpExpiresAt: null,
                                });
                        
                                // Generate tokens
                                const token = tokenService.generateToken(user._id, user.email, '1h');
                                const refreshToken = tokenService.generateToken(user._id, user.email, '7d');
                                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
                        
                                // Save the refresh token
                                const saveRefreshToken = new refreshTokens({
                                    user_id: user._id,
                                    token: refreshToken,
                                    expiresIn: expiresAt,
                                });
                                await saveRefreshToken.save();
                        
                                // Set the refresh token as a cookie
                                res.cookie('refreshToken', refreshToken, {
                                    httpOnly: false,
                                    secure: process.env.NODE_ENV === 'production',
                                    sameSite: 'Strict', // Protection against CSRF
                                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                                });
                        
                                // Add login history record
                                const randomCode = randomBytes(8).toString('hex');
                                loginHistory.addUserLoginRecord(req, user._id, randomCode);
                        
                                // Respond with tokens
                                res.status(200).json({
                                    message: 'Login successful',
                                    token: token,
                                    refreshToken: refreshToken,
                                });
                            } catch (error) {
                                handleError(res, error);
                            }
                        }
    

}





export default Authentication;