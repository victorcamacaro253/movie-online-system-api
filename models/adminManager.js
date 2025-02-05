import {Schema,model} from "mongoose"

const adminManagerSchema = new Schema ({
    username: {type:String,required:true},
    password: {type:String,required:true},
    roleId : {type:String,required:true},
    theaterId : {type:String},
    status: {type:String,enum:['active','inactive'],default:'active'}



})

const AdminManager = model('adminManager',adminManagerSchema)

export default AdminManager;