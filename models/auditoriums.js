import {Schema,model} from "mongoose";

const auditoriumSchema = new Schema(

 {
    theater_id:{
        type: Schema.Types.ObjectId,
        ref: 'theaters',
        required: true,
    },
    auditorium_number :{
        
        type:Number,
        required:true,
        },
    seat_layout:{
        rows:{
            type:[String],  // Array of row identifiers (e.g., "1", "2", "3")
            required:true,
        },
        columns:{
            type:[String], // Array of column identifiers (e.g., "A", "B", "C")
            required:true,
    },
 },
 audio_type:{
    type:String,
    required:true,
    enum:["Dolby","DTS","SDDS","THX","IMAX","None"],
    default:"None",
 },
 screen_type:{
    type:String,
    required:true,
    enum:["2D","3D","4D"],
    default:"2D",
 },
 screen_size:{
    type:String,
    required:true,
    enum:["Small","Medium","Large"],
    default:"Medium",
    },
    total_seats:{
        type:Number,
        required:true,
    },
},
    {
        timestamps:true,
    

})

const Auditorium = model('auditoriums',auditoriumSchema);

export default Auditorium;