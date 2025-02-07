import twilio from 'twilio';
import speakeasy from 'speakeasy';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER;

const generateAndSendOtp = async (phone) => {
    try {

        if (!phone || !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)) {
            throw new Error('Invalid phone number');
        }


        const otp = speakeasy.totp({
            secret: speakeasy.generateSecret({ length: 20 }).base32,
            digits: 6,
            encoding: 'base32',
        });


        // Calculate expiration time (5 minutes from now)
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds

        //Send the OTP via SMS using Twilio
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioNumber,
            to: phone,
        });
        
        return { otp, secret, expiresAt }; // Return OTP details for storage in the database

        
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send OTP');

        
    }
}



const verifyOtp = (otp, secret,expiresAt ) => {
    try {

        // Check if the OTP has expired
        if (Date.now() > expiresAt) {
            throw new Error('OTP has expired');
        }

        const result = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            window: 1, 
            });


            if (!result) {
                throw new Error('Invalid OTP');
            }

            return true; // OTP is valid;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to verify OTP');
    }
    }

export default {generateAndSendOtp, verifyOtp}