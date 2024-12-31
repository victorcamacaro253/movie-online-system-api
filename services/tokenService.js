import jwt from 'jsonwebtoken';

const generateToken = (userId,email,expiresIn)=>{
    const payload = {_id:userId,email:email}

    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: expiresIn})
    return token
}


const verifyToken=(token)=>{

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        return decode
    } catch (error) {
        return null
    }
}


export default {generateToken, verifyToken }