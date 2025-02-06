import {Schema,model} from "mongoose"

const adminManagerSchema = new Schema ({
    username: {type:String,required:true},
    password: {type:String,required:true},
    roleId : { type: Schema.Types.ObjectId,ref: "roles",required:true},
    theaterId : {type: Schema.Types.ObjectId,ref: "theaters"},
    status: {type:String,enum:['active','inactive'],default:'active'}



})
    
const AdminManager = model('adminmanagers',adminManagerSchema)

export default AdminManager;