import { Schema,model } from "mongoose";

const userSchema = new Schema({
    fullname: String,
    google_id:{
        type:String,
        
    },
    facebook_id:{
        type:String,

    },
    twitter_id:{
        type:String,
    },
    github_id:{
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
       
    },
    phone:{
        type:String

    },
    personal_ID:{
        type:String
        }
    ,
    role: {
        type: Schema.Types.ObjectId,ref:'roles',required:true
    },
    active: {
        type:Boolean
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
        
        roleId :{
            type: Schema.Types.ObjectId,
            ref: 'roles'
        },

})

const User = model('users',userSchema)

export default User;