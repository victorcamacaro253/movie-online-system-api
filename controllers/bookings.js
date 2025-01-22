import BookingModel from "../models/bookings.js";
import TicketPrice from "../models/ticketPrices.js";
import { getIo } from "../services/webSocket.js";


class Booking {

    static async getBooking(req,res){
        try {   
            const booking = await BookingModel.find().populate('user_id','fullname username email ');
            res.status(200).json(booking);
            } catch (error) {
                res.status(500).json({ message: error.message });
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