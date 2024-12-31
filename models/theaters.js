import { Schema,model } from "mongoose";

const locationSchema = new Schema ({
    address: {type:String,required: true },
    city: {type:String},
    state: {type:String},
    zipcode: {type:String},
    country:{type:String}
})


const openingHoursSchema = new Schema({
    open: {type:String,required: true },
    close: {type:String,required: true },
},{_id:false})


const theatersSchema =  new Schema({
name : {type:String,required:true},
location: {type:locationSchema,required:true},
total_auditoriums:{type:Number,required: true},
capacity:{type:Number,required:true},
total_employees: {type:Number,required:true},
facilities: {type:[String],required:true},
images:{type:[String],required:true},
email:{type:String,required: true},
phone:{type:String,required:true},
opening_hours: {
    monday: { type: openingHoursSchema, required: true },
    tuesday: { type: openingHoursSchema, required: true },
    wednesday: { type: openingHoursSchema, required: true },
    thursday: { type: openingHoursSchema, required: true },
    friday: { type: openingHoursSchema, required: true },
    saturday: { type: openingHoursSchema, required: true },
    sunday: { type: openingHoursSchema, required: true },
  },
},
  {
    timestamps: true,
  })

  const Theater = model("theaters",theatersSchema)

  export default Theater;

