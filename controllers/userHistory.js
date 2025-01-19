import UserHistoryModel from "../models/users_history.js";

class UserHistory{

    static async getAllUsersHistory(req, res) {
        try {
          const usersHistory = await UserHistoryModel.find()
            .populate('userId') // Populate user data
            .populate({
              path: 'bookingRecords',
              populate: [
                {path:'bookingId',model:'bookings',
                    populate:{
                        path:'showtime_id',
                        model:'showtimes'
                    }
                },
                { path: 'movieId', model: 'movies' },  // Populate movie details inside bookingRecords
                { path: 'showtimeId', model: 'showtimes' } // Populate showtime details inside bookingRecords
              ]
            })
            .populate('movieRatings.movieId') // Populate movie details in movieRatings
            .populate('watchedMovies.movieId'); // Populate movie details in watchedMovies
      
          res.json(usersHistory);
        } catch (error) {
            console.error(error);
          res.status(500).json({ message: error.message });
        }
      }
      

}


export default UserHistory;