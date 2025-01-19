import { Schema,model } from "mongoose";
import Showtime from "./showtimes.js";


const bookingRecordSchema= new Schema({
    bookingId: {type: Schema.Types.ObjectId,ref:'bookings',required:true},
    amountSpent:{type: Number,required:true},
    bookingDate:{type:Date,required:true},
    movieId:{type: Schema.Types.ObjectId,ref:'movies',required:true},
    numberOfTickets:{type:Number,required:true},
    showtimeId:{type:Schema.Types.ObjectId,ref:'showtimes',required:true}
})

const UserHistorySchema= new Schema({
    userId:{type: Schema.Types.ObjectId,ref:'users',required:true},
    totalMoviesBooked:{type:Number,default:0},
    totalAmountSpent:{type:Number,default:0},
    totalSpent:{type:Number,default:0},
    favoriteGenres: [String],
    averageRatingGiven: { type: Number, min: 0, max: 5 },
    movieRatings: [{
        movieId: { type: Schema.Types.ObjectId, ref: 'movies' },
        rating: { type: Number, min: 0, max: 5 }
      }],

      watchedMovies:[{
        movieId: { type: Schema.Types.ObjectId, ref: 'movies' },
        watchedAt:{type:Date,default: Date.now}
      }],

      bookingRecords:[bookingRecordSchema],
    },{
        timestamps:true
    


})

const UserHistory= model('users_History',UserHistorySchema);

export default UserHistory;