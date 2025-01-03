import Showtime from "../models/showtimes.js";

class ShowtimeController {
    
    static async getAllShowtimes(req,res){
        try {
            const showtimes =await Showtime.find()
            .populate({
                path: 'movie_id', // Populate the movie document
                populate: {
                  path: 'cast', // Populate the cast field of the movie
                  model: 'Actor', // Reference to the Actor model
                }
              })
            .populate('theater_id')  // Llenar los datos de 'theater_id'
           
    
    
            res.json(showtimes);
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error in getting showtimes' });
                }
    }

}
export default ShowtimeController;