import Showtime from "../models/showtimes.js";
import Auditorium from "../models/auditoriums.js";

class ShowtimeController {
    
/*    static async getAllShowtimes(req,res){
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

    */
    static async getAllShowtimes(req, res) {
      try {
          const showtimes = await Showtime.find()
              .populate({
                  path: 'movie_id', // Populate the movie document
                  populate: {
                      path: 'cast', // Populate the cast field of the movie
                      model: 'Actor', // Reference to the Actor model
                  },
              })
              .populate('auditorium_id')  // Populate auditorium details
              .populate('theater_id');   // Populate theater details
  
          // Group auditoriums by theater
          const groupedData = {};
          showtimes.forEach(showtime => {
              const theaterId = showtime.theater_id._id;
              if (!groupedData[theaterId]) {
                  groupedData[theaterId] = {
                      theater: showtime.theater_id, // Theater details
                      auditoriums: new Set(),      // Use Set to avoid duplicates
                      showtimes: [],
                  };
              }
  
              // Add auditorium only if it's not already in the set
              groupedData[theaterId].auditoriums.add(showtime.auditorium_id);
              groupedData[theaterId].showtimes.push({
                  showtime_id: showtime._id,
                  movie: showtime.movie_id,
                  start_time: showtime.start_time,
                  end_time: showtime.end_time,
              });
          });
  
          // Convert Set to Array for auditoriums
          const response = Object.values(groupedData).map(data => ({
              theater: data.theater,
              auditoriums: Array.from(data.auditoriums),
              showtimes: data.showtimes,
          }));
  
          res.json(response);
      } catch (error) {
          console.error(error);
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
            .populate('auditorium_id')  // Llenar los datos de 'auditorium_id'

            if(!showtime){
              return res.status(404).json({msg: 'Showtime not found'})
            }

            res.json(showtime);
            } catch (error) {
              console.log(error);
              res.status(500).json({ msg: 'Error in getting showtime' });
              }
              }



              static async getShowtimesByTheater(req,res){
                try {
                  const {id} = req.params;
                  const showtimes = await Showtime.find({theater_id:id})
                  .populate({
                    path: 'movie_id', // Populate the movie document
                    populate: {
                      path: 'cast', // Populate the cast field of the movie
                      model: 'Actor', // Reference to the Actor model
                      }
                      })
                      
                      res.json(showtimes);
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ msg: 'Error in getting showtimes' });
                        }
              }


              static async getShowtimesByAuditorium(req,res){
                try {
                  const {id} = req.params;
                  const showtimes = await Showtime.find({auditorium_id:id})
                  .populate({
                    path: 'movie_id', // Populate the movie document
                    populate: {
                      path: 'cast', // Populate the cast field of the movie
                      model: 'Actor', // Reference to the Actor model
                      }
                      })
                      .populate('auditorium_id')  // Llenar los datos de 'auditorium
                      .populate('theater_id')  // Llenar los datos de 'theater_id

                      res.json(showtimes);


                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ msg: 'Error in getting showtimes' });
                        }


              }


              static async getShowtimesByDate(req, res) {
                try {
                    const { date } = req.params; // Expecting date in 'YYYY-MM-DD' format
            
                    // Parse the date and calculate the start and end of the day
                    const startDate = new Date(`${date}T00:00:00Z`);
                    const endDate = new Date(`${date}T23:59:59Z`);
            
                    const showtimes = await Showtime.find({
                        date: {
                            $gte: startDate, // Greater than or equal to start of the day
                            $lte: endDate,   // Less than or equal to end of the day
                        },
                    })
                        .populate({
                            path: 'movie_id',
                            populate: {
                                path: 'cast',
                                model: 'Actor',
                            },
                        })
                        .populate('auditorium_id');
            
                    res.json(showtimes);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ msg: 'Error in getting showtimes' });
                }
            }
            

            static async getShowtimesByDateRange(req, res) {
              try {
                const { start_date, end_date } = req.params;
            
                // Fetch the showtimes within the date range
                const showtimes = await Showtime.find({
                  date: { $gte: new Date(start_date), $lte: new Date(end_date) },
                })
                  .populate({
                    path: 'movie_id',
                    populate: {
                      path: 'cast',
                      model: 'Actor',
                    },
                  })
                  .populate('auditorium_id')
                  .populate('theater_id');
            
                // Group the showtimes by theater and then by auditorium
                const groupedData = {};
                showtimes.forEach((showtime) => {
                  const theaterId = showtime.theater_id._id;
                  const auditoriumId = showtime.auditorium_id._id;
            
                  // Initialize theater if it doesn't exist
                  if (!groupedData[theaterId]) {
                    groupedData[theaterId] = {
                      theater: showtime.theater_id,
                      auditoriums: {},
                    };
                  }
            
                  // Initialize auditorium if it doesn't exist
                  if (!groupedData[theaterId].auditoriums[auditoriumId]) {
                    groupedData[theaterId].auditoriums[auditoriumId] = {
                      auditorium: showtime.auditorium_id,
                      showtimes: [],
                    };
                  }
            
                  // Add the showtime to the respective auditorium
                  groupedData[theaterId].auditoriums[auditoriumId].showtimes.push({
                    showtime_id: showtime._id,
                    movie: showtime.movie_id,
                    start_time: showtime.start_time,
                    end_time: showtime.end_time,
                    date: showtime.date,
                  });
                });
            
                // Format the response
                const response = Object.values(groupedData).map((theaterData) => ({
                  theater: theaterData.theater,
                  auditoriums: Object.values(theaterData.auditoriums).map((auditoriumData) => ({
                    auditorium: auditoriumData.auditorium,
                    showtimes: auditoriumData.showtimes,
                  })),
                }));
            
                res.json(response);
              } catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Error in getting showtimes' });
              }
            }
            

            static async getShowtimesByTheater(req,res){
              try {
                const {theater_id} = req.params;
                const showtimes = await Showtime.find({auditorium_id:theater_id})
                .populate({
                  path: 'movie_id',
                  populate: {
                    path: 'cast',
                    model: 'Actor',
                    }
                    })
                    .populate('auditorium_id')
                    res.json(showtimes);
                    }catch(error){
                      console.log(error);
                        
                      res.status(500).json({ msg: 'Error in getting showtimes' });
                      }

            }

            static async getShowtimesByTheaterAndDate(req, res) {
              try {
                  const { theater_id, date } = req.params; // Expecting 'theater_id' and 'date' in 'YYYY-MM-DD' format
          
                  // Parse the date and calculate the start and end of the day
                  const startDate = new Date(`${date}T00:00:00Z`);
                  const endDate = new Date(`${date}T23:59:59Z`);
          
                  // Find showtimes for the specific theater and date
                  const showtimes = await Showtime.find({
                      theater_id: theater_id, // Match the theater
                      date: {
                          $gte: startDate, // Match dates starting from the beginning of the day
                          $lte: endDate,   // Up to the end of the day
                      },
                  })
                      .populate({
                          path: 'movie_id',
                          populate: {
                              path: 'cast',
                              model: 'Actor',
                          },
                      })
                      .populate('auditorium_id');
          
                  res.json(showtimes);
              } catch (error) {
                  console.error(error);
                  res.status(500).json({ msg: 'Error in getting showtimes for the theater on the specified date' });
              }
          }
          

          static async createShowtime(req, res) {
            try {
                const { theater_id, auditorium_id, movie_id, start_time, end_time, date } = req.body;

                // Fetch the auditorium layout from the database
          const auditorium = await Auditorium.findById(auditorium_id);

           if (!auditorium) {
            return res.status(404).json({ msg: "Auditorium not found" });
              }

              const { rows, columns } = auditorium.seat_layout; 
              const total_seats = auditorium.total_seats; 


              const seats = [];

                // Loop through the rows and columns to generate seat objects
            rows.forEach(row => {
            columns.forEach(col => {
             const seat = {
               seat_id: `${row}${col}`, // Combine row and column to form seat_id (e.g., A1, A2, B1, B2, etc.)
              is_booked: false, // Initially, all seats are unbooked
               };
             seats.push(seat);
            });
          });

          // Calculate available seats
      const available_seats = seats.filter(seat => !seat.is_booked).length;

        
                // Parse start_time and end_time to ensure they're Date objects
                const startDate = new Date(start_time);
                const endDate = new Date(end_time);

                console.log(startDate,endDate,date)
        
                // Check for overlapping showtimes in the same theater and auditorium
                const existingShowtime = await Showtime.find({
                    theater_id: theater_id,
                    auditorium_id: auditorium_id,
                  //  date: date,
                    $or: [
                        {
                            start_time: { $lt: endDate }, // Check if the new start time is before an existing end time
                            end_time: { $gt: startDate }  // Check if the new end time is after an existing start time
                        }
                    ]
                });
        
                console.log(existingShowtime)
                // If there are overlapping showtimes, return an error
                if (existingShowtime.length > 0) {
                    return res.status(400).json({ msg: 'There is an overlapping showtime for this theater and auditorium.' });
                }
        
                // If no overlap, create the new showtime
                const newShowtime = new Showtime({
                    theater_id,
                    auditorium_id,
                    movie_id,
                    start_time: startDate,
                    end_time: endDate,
                    date: date,
                    total_seats,
                    seats,
                    available_seats
                });
        
                await newShowtime.save();
                res.json(newShowtime);
            } catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Error in creating showtime' });
            }
        }
        

}
export default ShowtimeController;