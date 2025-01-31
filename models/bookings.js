import { Schema,model } from "mongoose";
import showtime from "./showtimes.js";

const bookingSchema = new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'users',required:true},
    booking_date:{type:Date},
    showtime_id:{type:Schema.Types.ObjectId,ref:'showtimes',required:true},
    seats_booked: [
        {
          seat: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
            enum: ['standard', 'vip', 'child', 'Student','Adult','senior'],
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      total_price: {
        type: Number,
        required: true,
        },
    status: {  type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending',},
    payment_id:{type:Schema.Types.ObjectId,ref:'payments'},



})


const Booking = model('bookings', bookingSchema);

export default Booking;