import BookingModel from "../models/bookings.js";
import TicketPrice from "../models/ticketPrices.js";
import { getIo } from "../services/webSocket.js";
import Showtime from "../models/showtimes.js";


class Booking {

    static async getBooking(req,res){
        try {   
            const booking = await BookingModel.find().populate('user_id','fullname username email ');
            res.status(200).json(booking);
            } catch (error) {
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

            

          /*  const showtime = await Showtime.findOneAndUpdate(
                {
                    _id: showtime_id, // Match the showtime
                    "seats._id": seat_id, // Match the seat
                    "seats.is_booked": false, // Ensure the seat is not already booked
                },
                {
                    $set: { "seats.$.is_booked": true }, // Mark the seat as booked
                    $inc: { available_seats: -1 }, // Decrement available seats
                },
                { new: true } // Return the updated document if successful
            );
            if (!showtime) {
                return res.status(400).json({ message: "Seat already booked or not found" });
            }
            

*/
            
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

    static async createBooking(req,res){
     const {user_id,showtime_id,seats}=req.body;
     try {
        const ticketTypes = await TicketPrice.find({})

        let total_price = 0;
        const seats_booked= seats.map(seat=>{
            const ticket= ticketTypes.find(ticket=>ticket.type===seat.type);   
            if(!ticket){
                throw new Error(`Ticket type ${seat.type} not found`);
            }
            total_price += ticket.price;
            console.log(total_price);

            return{
                seat:seat.seat,
                type:seat.type,
                price:ticket.price
            }
        })

        const booking = new BookingModel({
            user_id,
            showtime_id,
            seats_booked,
            total_price,
            status:'pending'

        });

        await booking.save()

        const io = getIo();
        io.emit('seatBooked', {seats_booked});

        res.status(201).json(booking);
        
     } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
        
     }
    }

}

export default Booking;