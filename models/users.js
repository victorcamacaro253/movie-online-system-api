import { Schema,model } from "mongoose";

const userSchema = new Schema({
    fullname: String,
    google_id:{
        type:String,
        
    },
    facebook_id:{
        type:String,

    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String

    },
    personal_ID:{
        type:String
        }
    ,
    status: {
        type: String,
        enum: ['active', 'inactive'],default:'active',
    },
    cards:{
        debit :{
            type:String
            },
            credit:{
                type:String
                },
    },
    profile_image:{
        type:String

    },
     birthdate: {
        type: Date
        },
        google_id:{
            type:String
        },
        roleId :{
            type: Schema.Types.ObjectId,
            ref: 'roles'
        },

})

const User = model('users',userSchema)

export default User;