import BookingModel from "../models/bookings.js";


class Booking {

    static async getBooking(req,res){
        try {   
            const booking = await BookingModel.find().populate('user_id','fullname username email ');
            res.status(200).json(booking);
            } catch (error) {
                res.status(500).json({ message: error.message });
                }
            
    }

}

export default Booking;