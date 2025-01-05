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
            .populate('auditorium_id')  // Llenar los datos de 'auditorium_id'
           
    
    
            res.json(showtimes);
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error in getting showtimes' });
                }
    }

    static async getShowtimeById(req,res){
        try {
            const {id} = req.params;
            const showtime = await Showtime.findById(id)
            .populate({
              path: 'movie_id', // Populate the movie document
              populate: {
                path: 'cast', // Populate the cast field of the movie
                model: 'Actor', // Reference to the Actor model
                }
            })
            .populate('theater_id')  // Llenar los datos de 'theater_id
            res.json(showtime);
            } catch (error) {
              console.log(error);
              res.status(500).json({ msg: 'Error in getting showtime' });
              }
              }

}
export default ShowtimeController;