import BookingModel from "../models/bookings.js";
import TicketPrice from "../models/ticketPrices.js";
import { getIo } from "../services/webSocket.js";
import Showtime from "../models/showtimes.js";
import UserHistory from "../models/users_history.js";
import mongoose from 'mongoose';


class Booking {
    static async getBooking(req, res) {
        try {   
            const booking = await BookingModel.find()
                .populate('user_id', 'fullname username email')
                .populate({
                    path: 'showtime_id',
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
                });
    
            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async getBookingById (req,res){
        try {
            const {id} = req.params;
            const booking = await BookingModel.findById(id)
            .populate('user_id','fullname username email ')
            .populate({
                path: 'showtime_id',
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
            });
            
          //  .populate('ticket_id','price seat_number seat_type');
            res.status(200).json(booking);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                }
                }

                static async getBookingsByUserId(req, res) {
                    try {
                        const { userId } = req.params;
                        console.log(userId);
                
                        // Get bookings and populate the showtime details
                        const bookings = await BookingModel.find({ user_id: userId })
                            .populate({
                                path: 'showtime_id',
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
                            });
                
                        // If no bookings found
                        if (!bookings.length) {
                            return res.status(404).json({ message: "No bookings found for this user" });
                        }
                        // Extract user data from the first booking
                        const { fullname, username, email } = bookings[0].user_id;
                
                        // Calculate totalMoviesBooked (unique movie titles) & totalTicketsBought
                        const movieTitles = new Set();
                        let totalTicketsBought = 0;
                
                        const formattedBookings = bookings.map(booking => {
                            const movieTitle = booking.showtime_id?.movie_id?.title;
                            if (movieTitle) movieTitles.add(movieTitle);

                            totalTicketsBought += booking.seats_booked.length; // Assuming 'seats_booked' is an array
                
                            return {
                                _id: booking._id,
                                showtime: booking.showtime_id,
                                seats: booking.seats_booked,
                                total_price: booking.total_price,

                            };
                        });
                
                        // Format the response
                        const response = {
                            user: {
                                fullname,
                                username,
                                email
                            },
                            statistics: {
                                totalMoviesBooked: movieTitles.size,
                                totalTicketsBought
                            },
                            bookings: formattedBookings
                        };
                
                        res.status(200).json(response);
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: error.message });
                    }
                }
                
              /*  static async getTotalGrossed(req, res) {
                    try {
                
                        // Get bookings for the user
                        const bookings = await BookingModel.find();
                
                    
                        console.log(bookings);
                
                        // Calculate total grossed
                        const totalGrossed = bookings.reduce((total, booking) => {
                            return total + booking.total_price; // Sum the total price of each booking
                        }, 0);
                
                        // Format the response
                        res.status(200).json({ totalGrossed });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: error.message });
                    }
                }

                */
                static async getTotalGrossed(req, res) {
                    try {
                      const aggregationResult = await BookingModel.aggregate([
                        {
                          $lookup: {
                            from: "showtimes", // Match your showtimes collection name
                            localField: "showtime_id",
                            foreignField: "_id",
                            as: "showtime"
                          }
                        },
                        { $unwind: "$showtime" },
                        {
                          $lookup: {
                            from: "theaters", // Match your theaters collection name
                            localField: "showtime.theater_id",
                            foreignField: "_id",
                            as: "theater"
                          }
                        },
                        { $unwind: "$theater" },
                        {
                          $lookup: {
                            from: "movies", // Match your movies collection name
                            localField: "showtime.movie_id",
                            foreignField: "_id",
                            as: "movie"
                          }
                        },
                        { $unwind: "$movie" },
                        {
                            $addFields: {
                              // Normalize city names to lowercase for consistent grouping
                              normalizedCity: { $toLower: "$theater.location.city" }
                            }
                          },
                        {
                          $facet: {
                            totalGrossed: [
                              { $group: { _id: null, total: { $sum: "$total_price" } } }
                            ],
                            byCity: [
                              { $group: { 
                                _id: "$normalizedCity",
                                total: { $sum: "$total_price" },
                                theaters: { $addToSet: "$theater.name" }
                              }},
                              { $project: { city: "$_id", total: 1, theaters: 1, _id: 0 } }
                            ],
                            byTheater: [
                              { $group: {
                                _id: {
                                  theater: "$theater.name",
                                  city: "$theater.location.city"
                                },
                                total: { $sum: "$total_price" }
                              }},
                              { $project: {
                                theater: "$_id.theater",
                                city: "$_id.city",
                                total: 1,
                                _id: 0
                              }}
                            ],
                            byMovie: [
                              { $group: {
                                _id: "$movie.title",
                                total: { $sum: "$total_price" },
                                theaters: { $addToSet: "$theater.name" }
                              }},
                              { $project: { movie: "$_id", total: 1, theaters: 1, _id: 0 } }
                            ]
                          }
                        }
                      ]);
                  
                      const result = {
                        totalGrossed: aggregationResult[0]?.totalGrossed[0]?.total || 0,
                        byCity: aggregationResult[0]?.byCity || [],
                        byTheater: aggregationResult[0]?.byTheater || [],
                        byMovie: aggregationResult[0]?.byMovie || []
                      };
                  
                      res.status(200).json(result);
                    } catch (error) {
                      console.error(error);
                      res.status(500).json({ message: error.message });
                    }
                  }



    static async bookSeat(req,res){
        try {
         const {seat_id,showtime_id}=req.body;

          console.log(seat_id,showtime_id);

        const showtime = await Showtime.findById(showtime_id);

         if(!showtime){
          return res.status(404).json({message:'Showtime not found'});
         }

       const seat = showtime.seats.find(seat => seat._id.toString() === seat_id);

         if(!seat){
             return res.status(404).json({message:'Seat not found'});
         }

         if(seat.is_booked){
             return res.status(400).json({message:'Seat already booked'});
         }

            seat.is_booked=true;

            showtime.available_seats -=1;

            await showtime.save();

            
            
            const io = getIo();
           // console.log("WebSocket instance:", io);

            const seatData = { seat_id, showtime_id, status: "booked" };
            io.emit("seatBooked", seatData); // Emit the event
          //  console.log("Seat booked WebSocket event emitted:", seatData);
    
            
            return res.status(200).json({message:'Seat booked successfully'});

        }catch(error){

            return res.status(500).json({message:error.message});
        }
    }

   

    static async createBooking(req, res) {
        const { user_id, showtime_id, seats } = req.body;
       // const session = await mongoose.startSession(); // Start transaction
        
        try {
          
          // 1. Create Booking
          const ticketTypes = await TicketPrice.find({})
          console.log(ticketTypes)
          let total_price = 0;
       console.log(seats)
          const seats_booked = seats.map(seat => {
            const ticket = ticketTypes.find(t => t.type === seat.type);
            if (!ticket) throw new Error(`Ticket type ${seat.type} not found`);
            
            total_price += ticket.price;
            return {
              seat: seat.seat,
              type: seat.type,
              price: ticket.price
            };
          });
      
          const booking = new BookingModel({
            user_id,
            showtime_id,
            seats_booked,
            total_price,
            status: 'pending'
          });
      
          await booking.save();
      
          // 2. Update User History
          const showtime = await Showtime.findById(showtime_id);
          if (!showtime) throw new Error("Showtime not found");
      
          await UserHistory.updateOne(
            { userId: user_id },
            {
              $push: {
                bookingRecords: {
                  bookingId: booking._id,
                  numberOfTickets: seats_booked.length // Derived from booking
                }
              },
              $inc: {
                totalMoviesBooked: 1,
                totalAmountSpent: total_price
              },
              $addToSet: { // Prevent duplicate movie entries
                watchedMovies: { 
                  movieId: showtime.movie_id,
                  watchedAt: new Date() 
                }
              }
            },
            { upsert: true } // Create user_history if it doesn't exist
          );
      
          // 3. Emit real-time event
          const io = getIo();
          io.emit('seatBooked', { seats_booked: booking.seats_booked });
      
          res.status(201).json(booking);
      
        } catch (error) {
        
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      }

}

export default Booking;