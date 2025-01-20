import { Schema,model } from "mongoose";
import showtime from "./showtimes.js";

const bookingSchema = new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'users',required:true},
    booking_date:{type:Date,required:true},
    showtime_id:{type:Schema.Types.ObjectId,ref:'showtimes',required:true},
    seats_booked:{type:[String],required:true},
    status: {  type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending',},
    payment_id:{type:Schema.Types.ObjectId,ref:'payments'},



})


const Booking = model('bookings', bookingSchema);

export default Booking;