import UserHistoryModel from "../models/users_history.js";
import UserModel from "../models/users.js";
import handleError from "../utils/handleError.js";

class UserHistory{

  static async getAllUsersHistory(req, res) {
    try {
        const usersHistory = await UserHistoryModel.find()
            .populate('userId', "_id fullname username email personal_ID") // Populate user data
            .populate({
                path: 'bookingRecords',
                populate: [
                    {
                        path: 'showtime_id', // Populate showtime details inside bookings
                        model: 'showtimes',
                        select: '-total_seats -available_seats -seats',
                        populate: [
                            {
                                path: 'movie_id', // Populate movie details inside showtimes
                                model: 'movies',
                                select: 'title'
                            },
                            {
                                path: 'theater_id', // Populate theater details inside showtimes
                                model: 'theaters',
                                select: 'name'
                            },
                            {
                                path: 'auditorium_id', // Populate auditorium details inside showtimes
                                model: 'auditoriums',
                                select: 'auditorium_number'
                            }
                        ]
                    }
                ]
            })
            .populate('movieRatings.movieId') // Populate movie details in movieRatings
            .populate('watchedMovies.movieId'); // Populate movie details in watchedMovies




        res.json( usersHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
      


      static async getUserHistory (req,res){
        const {userId}= req.params
        try {
          
          const userHistory = await UserHistoryModel.find({userId:userId})
          .populate('userId',"_id fullname username email personal_ID") // Populate user data
          .populate({
            path: 'bookingRecords',
            populate: [
              {path:'bookingId',model:'bookings',
                  populate:{
                      path:'showtime_id',
                      model:'showtimes',
                      select:'-total_seats -available_seats -seats',
                      populate:[
                        {
                        path:'movie_id',
                        model:'movies',
                        select: 'title'
                      },
                      {
                        path:'theater_id',
                        model:'theaters',
                        select: 'name'
                      },
                      {
                        path:'auditorium_id',
                        model:'auditoriums',
                        select: 'auditorium_number'
                      }
                    ]
                  }
              },
              { path: 'movieId', model: 'movies', select:'_id title'},  // Populate movie details inside bookingRecords
              { path: 'showtimeId', model: 'showtimes' } // Populate showtime details inside bookingRecords
            ]
          })
          .populate('movieRatings.movieId') // Populate movie details in movieRatings
          .populate('watchedMovies.movieId'); // Populate movie details in watchedMovies
    
        res.json(userHistory);

        }catch(error){
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      }


      static async addUserHistoryRecord(req,res){
        const {userId,bookingId,showtimeId,amountSpent,numberOfTickets}= req.body

        try {
          //step #1  Find the user

          const user = await UserModel.findById(userId)

          if(!user){
            return res.status(404).json({ message: 'User not found' })
          }

          //step #2  Create the new booking record
          const newBookingRecord={
            bookingId,
            amountSpent,
            numberOfTickets,
            showtimeId
        

          }

         // Step 3 Find the user's history
         const userHistory= await UserHistoryModel.finOne({userId})

         if(userHistory){
          // If history exists, update the user's booking records and other statistics
          userHistory.bookingRecords.push(newBookingRecord)
          userHistory.totalMoviesBookied += 1
          userHistory.totalAmountSpent += amountSpent

          await userHistory.save()

          return res.status(200).json({message: 'History record added Succesfully'})

         }else{
          // If history does not exist, create a new user history document
          const newUserHistory = new UserHistoryModel({
            userId,
            bookingRecords: [newBookingRecord],
            totalMoviesBookied: 1,
            totalAmountSpent: amountSpent
            })

            await newUserHistory.save()
            return res.status(200).json({message: 'User history created and record added'})
         }

        } catch (error) {
          handleError(res,error)
          
        }
      }


      static async getTotalGross(req, res) {
        try {
          const result = await UserHistoryModel.find()
          .populate('userId', "_id fullname username email personal_ID") // Populate user data
          .populate({
              path: 'bookingRecords',
              populate: [
                  {
                      path: 'showtime_id', // Populate showtime details inside bookings
                      model: 'showtimes',
                      select: '-total_seats -available_seats -seats',
                      populate: [
                          {
                              path: 'movie_id', // Populate movie details inside showtimes
                              model: 'movies',
                              select: 'title'
                          },
                          {
                              path: 'theater_id', // Populate theater details inside showtimes
                              model: 'theaters',
                              select: 'name'
                          },
                          {
                              path: 'auditorium_id', // Populate auditorium details inside showtimes
                              model: 'auditoriums',
                              select: 'auditorium_number'
                          }
                      ]
                  }
              ]
          })
          .populate('movieRatings.movieId') // Populate movie details in movieRatings
          .populate('watchedMovies.movieId'); // Populate movie details in watchedMovies

        console.log(result)

          let total_gross = 0;
          result.forEach(user => {
            user.bookingRecords.forEach(booking => {
              console.log(booking.total_price)
              total_gross += booking.total_price || 0; // Handle missing values
            });
          });

          console.log(total_gross)
    
        //  const totalGross = result.length > 0 ? parseFloat(result[0].totalGross.toString()) : 0;
          res.json({ total_gross });
        } catch (error) {
          handleError(res, error);
        }
      }

}



export default UserHistory;