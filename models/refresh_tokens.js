import { Schema,model } from "mongoose";



const refreshTokenSchema = new Schema ({
    user_id:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresIn:{
        type:Date,
        required:true
    },
    revoked:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
        },
        updatedAt:{
            type:Date,
            default:Date.now
            }
        
})

const refreshToken=  model('refreshTokens', refreshTokenSchema);

export default refreshToken;