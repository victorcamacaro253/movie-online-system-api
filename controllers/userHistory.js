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

   //   You might want to allow Admins to update their booking records. This could be useful if they need to change details about a booking.
     
   static async updateUserHistoryRecord(req, res) {
        const { userId, bookingId } = req.params;
        const updates = req.body;
    
        try {
            const userHistory = await UserHistoryModel.findOneAndUpdate(
                { userId, 'bookingRecords.bookingId': bookingId },
                { $set: updates },
                { new: true }
            );
    
            if (!userHistory) {
                return res.status(404).json({ message: 'User  history or booking record not found' });
            }
    
            res.json(userHistory);
        } catch (error) {
            handleError(res, error);
        }
    }

    //Allow Admin to delete a specific booking record from their history.
    static async deleteUserHistoryBookingRecord(req, res) {
      const { userId, bookingId } = req.params;
  
      try {
          const userHistory = await UserHistoryModel.findOneAndUpdate(
              { userId },
              { $pull: { bookingRecords: { bookingId } } },
              { new: true }
          );
  
          if (!userHistory) {
              return res.status(404).json({ message: 'User  history not found' });
          }
  
          res.json({ message: 'Booking record deleted successfully', userHistory });
      } catch (error) {
          handleError(res, error);
      }
  }
  static async getUserHistoryByDate(req, res) {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        // Fetch user history
        const userHistory = await UserHistoryModel.findOne({ userId })
            .populate('userId', "_id fullname username email personal_ID")
            .populate({
                path: 'bookingRecords',
                model: 'bookings', // Assuming bookingRecords references the bookings collection
                populate: {
                    path: 'showtime_id', // Populate showtime details
                    model: 'showtimes',
                    select: '-total_seats -available_seats -seats',
                    populate: [
                        {
                            path: 'movie_id',
                            model: 'movies',
                            select: 'title'
                        },
                        {
                            path: 'theater_id',
                            model: 'theaters',
                            select: 'name'
                        },
                        {
                            path: 'auditorium_id',
                            model: 'auditoriums',
                            select: 'auditorium_number'
                        }
                    ]
                }
            });

        if (!userHistory) {
            return res.status(404).json({ message: 'User  history not found' });
        }

        // Filter booking records by date range
        const filteredBookingRecords = userHistory.bookingRecords.filter(booking => {
            const bookingDate = new Date(booking.booking_date); // Use the correct field name
            return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
        });

        // Calculate totals if there are booking records in the date range
        if (filteredBookingRecords.length > 0) {
            const totalMoviesBooked = filteredBookingRecords.length;
            const totalTicketsBought = filteredBookingRecords.reduce((total, booking) => total + booking.seats_booked.length, 0);
            const totalSpent = filteredBookingRecords.reduce((total, booking) => total + booking.total_price, 0);

            // Return the user history with calculated totals and filtered booking records
            res.json({
                userId: userHistory.userId,
                totalMoviesBooked,
                totalTicketsBought,
                totalSpent,
                bookingRecords: filteredBookingRecords,
                message: 'Data retrieved successfully'
            });
        } else {
            // If no booking records found in the date range
            res.json({
                userId: userHistory.userId,
                totalMoviesBooked: 0,
                totalTicketsBought: 0,
                totalSpent: 0,
                bookingRecords: [],
                message: 'No data found between the specified dates'
            });
        }
    } catch (error) {
        handleError(res, error);
    }
}
}



export default UserHistory;