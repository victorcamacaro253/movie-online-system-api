import {Schema,model} from 'mongoose';
import Movie from './movies.js';

const seatSchema = new Schema({ 
    seat_id: {type: String, required: true},
    is_booked: {type: Boolean, default: false},
})

const showtimeSchema = new Schema({
    movie_id: [
        {type: Schema.Types.ObjectId, 
         ref: "movies", 
         required: true}],
    theater_id: [{type: Schema.Types.ObjectId, ref: "theaters", required: true}],
 auditorium_id: {type: Schema.Types.ObjectId, ref: "Auditorium", required: true},
    start_time: {type: Date, required: true},
    end_time: {type: Date, required: true},
    total_seats: {type: Number, required: true},
    available_seats: {type: Number, required: true},
    seats: { type: [seatSchema], required: true} },
    {
        timestamps: true
    
})

const Showtime = model('showtimes',showtimeSchema);

export default Showtime;