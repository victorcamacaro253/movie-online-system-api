import Movie from '../models/movies.js'
import Actor from '../models/actors.js'
import ProductionCompany from '../models/productionCompanies.js';
import Showtime from '../models/showtimes.js';
import mongoose from 'mongoose';

class Movies {
    
  static async getAllMovies(req, res) {
    try {
      const movies = await Movie.find().populate("cast","name image").populate("productionCompany","name");
    //  console.log("Fetched Movies:", movies); // Log fetched movies
      
      if (movies.length === 0) {
        return res.status(404).json({ message: "No movies found" });
      }
      res.json(movies);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching movies" });
    }
  }


   static async getMovieByTitle(req,res){
    const {title} = req.params;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    
    try{
     
      const movie = await Movie.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } }).populate("cast","name image").populate("productionCompany","name");

      if(!movie){
        return res.status(404).json({message:"Movie not found"});
        }
        res.json(movie);
        }catch(error){
          console.log(error);
          res.status(500).json({message:"Error fetching movie"});
          }
          
   }

   static async getMoviesByYear(req, res) {
    const { date } = req.query;
  
    if (!date || date.trim() === "") {
      return res.status(400).json({ message: "Date is required" });
    }
  
    try {
      // Crear un rango de fechas para el año especificado
      const startDate = new Date(`${date}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${date}-12-31T23:59:59.999Z`);
  
      // Buscar películas dentro del rango
      const movies = await Movie.find({
        release_date: { $gte: startDate, $lte: endDate },
      }).populate("cast","name image").populate("productionCompany","name");
  
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found for the given date" });
      }
  
      const total_movies = movies.length

      res.json({movies,
        total_movies
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching movies" });
    }
  }
  

 static async getMoviesByGenre(req, res) {
  const { genre } = req.query;
  try{
    const movies = await Movie.find({ genre:  { $regex: new RegExp(`^${genre}$`, 'i') } }).populate("cast","name image").populate("productionCompany","name");
    if(!movies || movies.length === 0){
      return res.status(404).json({message:"No movies found for the given genre"});
      }

     const total_movies= movies.length;
      res.json({
        movies
        ,total_movies});
      
      }catch(error){
        console.log(error);
        res.status(500).json({message:"Error fetching movies"});
        }
        
  }

  static async getMoviesCurrentlyPlaying(req,res){
    try{
      const movies = await Movie.find({status: "playing"}).populate("cast","name image").populate("productionCompany","name");
      if(!movies || movies.length === 0){
        return res.status(404).json({message:"No movies found for the given date"});
        }

        const total_movies= movies.length;

        res.json({movies,
          total_movies});

        }catch(error){
          console.log(error);
          res.status(500).json({message:"Error fetching movies"});
          }


  }

  static async getMoviesPlayingByTheater(req, res) {
    try {
      const { theater, status = "playing" } = req.query; // Default status to "playing"
  
      // Step 1: Find all showtimes for the given theater
      const showtimes = await Showtime.find({ theater_id: theater })
        .populate({
          path: 'movie_id',
          match: { status }, // Filter movies by the given status
          select: 'title description genre director producers cast runtime language ageRating poster  status', // Fetch only relevant movie fields
          populate: { 
            path: 'cast', 
            select: 'name image' // Populate cast details (name and image)
          }
        })
       
  
      // Step 2: Filter out showtimes with no movie match
      const validShowtimes = showtimes.filter((showtime) => showtime.movie_id);
  
      if (!validShowtimes.length) {
        return res.status(404).json({ message: "No movies found for the given theater and status" });
      }
  
      // Step 3: Group showtimes by movie
      const movies = validShowtimes.reduce((result, showtime) => {
        const movieId = showtime.movie_id._id.toString();
  
        // Check if movie is already in the result
        const movieIndex = result.findIndex((movie) => movie.movie_id === movieId);
  
        if (movieIndex === -1) {
          // Add new movie entry with initial showtime
          result.push({
            movie_id: movieId,
            title: showtime.movie_id.title,
            description:showtime.movie_id.description,
            genre:showtime.movie_id.genre,
            director: showtime.movie_id.director,
            producers: showtime.movie_id.producers,
            cast: showtime.movie_id.cast,
            runtime: showtime.movie_id.runtime,
            language: showtime.movie_id.language,
            ageRating: showtime.movie_id.ageRating,
            poster: showtime.movie_id.poster,
            status: showtime.movie_id.status,
            showtimes: [
              {
                start_time: showtime.start_time,
                end_time: showtime.end_time,
                auditorium_id: showtime.auditorium_id,
                available_seats: showtime.available_seats,
              },
            ],
          });
        } else {
          // Add the showtime to the existing movie entry
          result[movieIndex].showtimes.push({
            start_time: showtime.start_time,
            end_time: showtime.end_time,
            auditorium_id: showtime.auditorium_id,
            available_seats: showtime.available_seats,
          });
        }
  
        return result;
      }, []);
  
      const total_movies = movies.length;
  
      res.json({
        movies,
        total_movies,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching movies" });
    }
  }
  
  static async countMoviesByGenre(req,res){
    try {
      const genreCounts= await Movie.aggregate([
        {
          $unwind:"$genre"
        },
        {
          $group:{
            _id:"$genre",
            total_movies:{$sum:1}
        }
      },
      {
        $sort:{total_movies:-1}
      }
      ])

      if (!genreCounts || genreCounts.length === 0) {
        return res.status(404).json({ message: "No movies found" });
      }

      res.json(genreCounts)
    } catch (error) {
      
    }
  }


  static async getMovieById(req,res){
    const {id}= req.params
    try {
      const movie = await Movie.findById(id).populate("cast","name image").populate("productionCompany","name");

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);

        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error fetching movie" });
          }

  }


  static async getMoviesByActor(req,res){
    const {id}= req.params
    try {
      const movies = await Movie.find({$or:[{cast:id},{director:id}]}).populate("cast","name image").populate("productionCompany","name");
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found" });
        }

        const total_movies= movies.length


        res.json({
          movies,
          total_movies
        })


        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error fetching movies" });
          }
  }
          
  static async getMoviesByActorName(req, res) {
    const { name } = req.params;
  
    try {
      // Step 1: Find the actor(s) by name
      const actors = await Actor.find({ name: new RegExp(name, "i") }); // Case-insensitive match
      if (!actors || actors.length === 0) {
        return res.status(404).json({ message: "No actors found with this name" });
      }
  
      // Step 2: Get the actor IDs
      const actorIds = actors.map((actor) => actor._id);
  
      // Step 3: Find movies where the actor is in the cast or is the director
      const movies = await Movie.find({
        $or: [{ cast: { $in: actorIds } }, { director: { $in: actorIds } }],
      }).populate("cast", "name image").select("title genre release_date bookings_count").populate("director", "name image").populate("productionCompany","name");
  
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found for this actor" });
      }
  
      const total_movies= movies.length
      // Step 4: Return the movies
      res.json({movies,
        total_movies});

      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching movies" });
    }
  }
  
  static async getMoviesByDateRange(req,res){
    try {
      const {startDate,endDate}= req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      
      const movies = await Movie.find({
        release_date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
          }
          }).populate("cast","name image")
          .populate("productionCompany","name");

       if (!movies || movies.length === 0) {
      return res.status(404).json({ message: "No movies found in the specified date range" });
      }


       res.json({ movies, totalMovies: movies.length });

         } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching movies" });
            }

  }

  static async getMoviesByStatus(req,res){
    try {
      const {status}= req.query
      const movies = await Movie.find({status}).populate("cast","name image").populate("productionCompany","name");
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found with the specified status" });
          }
          res.json({ movies, totalMovies: movies.length });
          } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching movies" });
            }

  }

  static async getPaginatedMovies(req, res) {
    try {
      // Set default values for page and limit if not provided
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  
      const movies = await Movie.paginate({}, { page, limit });
  
      res.json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching movies" });
    }
  }
  

  static async addMovie(req, res) {
    console.log(req.body)
    try {
      const {
        title,
        description,
        genre,
        director,
        producers,
        cast,
        runtime,
        language,
        rating,
        ageRating,
        release_date,
        trailer,
        country,
        status,
        productionCompany
      } = req.body;
  
      // Validate required fields
      if (
        !title ||
        !description ||
        !genre ||
        !director ||
        !producers ||
        !cast ||
        !runtime ||
        !language ||
        !rating ||
        !ageRating ||
        !release_date ||
        !country ||
        !status
      ) {
        return res.status(400).json({
          error: "All required fields must be provided.",
        });
      }
  

      const existingMovie = await Movie.findOne({title})

      if(existingMovie){
        return res.status(400).json({error: "Movie already exists"})
      }

     // const poster = req.file ? `/uploads/poster/${req.file.filename}` : null;
     const poster = req.files.poster
      ? `/uploads/posters/${req.files.poster[0].filename}`
      : null;

      // Validate arrays
     /* if (!Array.isArray(genre) || !Array.isArray(producers) || !Array.isArray(cast)) {
        return res.status(400).json({
          error: "Genre, producers, and cast must be arrays.",
        });
      }*/

        // Convert cast IDs to an array of ObjectId if they are not already
    const castIds = cast.map(id => new mongoose.Types.ObjectId(id));
console.log(req.files.images)
      // Process additional images with descriptions
      const images = [];
      if (req.files.images) {
        req.files.images.forEach((file, index) => {
          images.push({
            path: `/uploads/movies/${file.filename}`, // Save the uploaded file path
            description: req.body[`images[${index}][description]`] || "", // Save the description
          });
        });
      }
  
      // Create a new movie document
      const newMovie = new Movie({
        title,
        description,
        genre,
        director,
        producers,
        cast: castIds, // Use the converted cast IDs

        runtime,
        language,
        rating,
        ageRating,
        release_date,
        trailer,
        poster,
        country,
        status,
        images,
        productionCompany
      });
  
      // Save the movie to the database
      const savedMovie = await newMovie.save();
  
      res.status(201).json(savedMovie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding the movie." });
    }
  }

/*
  static async addMultipleMovies(req, res) {
    try {
      const { movies } = req.body;
  
      if (!movies || !Array.isArray(movies)) {
        return res.status(400).json({
          error: "An array of movies must be provided.",
        });
      }
  
      // Check for existing movies
      const existingMovies = await Movie.find({
        title: { $in: movies.map((movie) => movie.title) },
      });
  
      const existingTitles = existingMovies.map((movie) => movie.title);
  
      // Filter out duplicates
      const uniqueMovies = movies.filter(
        (movie) => !existingTitles.includes(movie.title)
      );
  
      // Insert unique movies into the database
      let insertedMovies = [];
      if (uniqueMovies.length > 0) {
        insertedMovies = await Movie.insertMany(uniqueMovies, {
          ordered: false, // Continue even if some fail
        });
      }
  
      // Respond with success and details
      res.status(200).json({
        message: "Movies processed successfully.",
        insertedMovies,
        skippedMovies: existingTitles,
      });
    } catch (error) {
      console.error(error);
  
      // Handle specific MongoDB write errors
      if (error.writeErrors) {
        const failedMovies = error.writeErrors.map((err) => err.err.op.title);
        return res.status(207).json({
          message: "Partial success. Some movies could not be added.",
          insertedMovies,
          failedMovies,
        });
      }
  
      res.status(500).json({ error: "Error adding the movies." });
    }
  }
  */
  
  static async addMultipleMovies(req, res) {
    console.log(req.body)
    console.log(req.files)
    try {
      const { movies } = req.body; // Array of movies sent in the request
  
      // Validate that movies is provided and is an array
      if (!movies || !Array.isArray(movies)) {
        return res.status(400).json({
          error: "An array of movies must be provided.",
        });
      }

      
  
      const insertedMovies = [];
      const skippedMovies = [];
  
      for (const movie of movies) {
        const {
          title,
          description,
          genre,
          director,
          producers,
          cast,
          runtime,
          language,
          rating,
          ageRating,
          release_date,
          trailer,
          country,
          status,
          productionCompany
        } = movie;
  
        // Validate required fields
        if (
          !title ||
          !description ||
          !genre ||
          !director ||
          !producers ||
          !cast ||
          !runtime ||
          !language ||
          !rating ||
          !ageRating ||
          !release_date ||
          !country ||
          !status
        ) {
          skippedMovies.push({
            title,
            reason: "Missing required fields.",
          });
          continue; // Skip this movie and move to the next
        }
  
        // Check if the movie already exists
        const existingMovie = await Movie.findOne({ title });
        if (existingMovie) {
          skippedMovies.push({
            title,
            reason: "Movie already exists.",
          });
          continue; // Skip this movie
        }
  
        // Handle poster (assumes poster is provided as a file)
       /* const poster = req.files?.find(
          (file) => file.originalname === movie.posterFilename
        )
          ? `/uploads/poster/${
              req.files.find((file) => file.originalname === movie.posterFilename)
                .filename
            }`
          : null; */

          const poster = req.files.poster
      ? `/uploads/posters/${req.files.poster[0].filename}`
      : null;
  
        // Validate arrays
        /* You can uncomment this if needed
        if (!Array.isArray(genre) || !Array.isArray(producers) || !Array.isArray(cast)) {
          skippedMovies.push({
            title,
            reason: "Genre, producers, and cast must be arrays.",
          });
          continue; // Skip this movie
        }
        */
  
        const castIds = cast.map((id) => new mongoose.Types.ObjectId(id));

        // Handle images
  const images = req.files.images ? req.files.images.map(file => ({
    path: `/uploads/movies/${file.filename}`,
    description: "", // You can add logic to handle descriptions if needed
  })) : [];
        // Create a new movie document
        const newMovie = new Movie({
          title,
          description,
          genre,
          director,
          producers,
          cast: castIds, // Use the converted cast IDs
          runtime,
          language,
          rating,
          ageRating,
          release_date,
          trailer,
          poster,
          country,
          status,
          images,
          productionCompany
        });
  
        try {
          // Save the movie to the database
          const savedMovie = await newMovie.save();
          insertedMovies.push(savedMovie);
        } catch (saveError) {
          console.error("Error saving movie:", saveError);
          skippedMovies.push({
            title,
            reason: "Error saving the movie.",
          });
        }
      }
  
      // Respond with success and details of processed movies
      res.status(200).json({
        message: "Movies processed successfully.",
        insertedCount: insertedMovies.length,
        skippedCount: skippedMovies.length,
        insertedMovies,
        skippedMovies,
      });
    } catch (error) {
      console.error("Error processing movies:", error);
      res.status(500).json({ error: "Error adding the movies." });
    }
  }
  

  static async updateMovie(req,res){
    try {
      const { id } = req.params; // Get the movie ID from the request params
      const updateData = req.body; // Get the updated data from the request body
  
      // Check if the movie exists in the database
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }
  
      // Validate arrays if present in the update data
      if (updateData.genre && !Array.isArray(updateData.genre)) {
        return res.status(400).json({ error: "Genre must be an array." });
      }
  
      if (updateData.producers && !Array.isArray(updateData.producers)) {
        return res.status(400).json({ error: "Producers must be an array." });
      }
  
      if (updateData.cast && !Array.isArray(updateData.cast)) {
        return res.status(400).json({ error: "Cast must be an array." });
      }
  
      // Filter out fields that are undefined or invalid
      const fieldsToUpdate = {};
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          fieldsToUpdate[key] = updateData[key];
        }
      });
  
      // Update the movie document with dynamic fields
      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        { $set: fieldsToUpdate }, // Update only the provided fields
        { new: true, runValidators: true } // Return the updated document and enforce schema validation
      );
  
      res.status(200).json(updatedMovie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating the movie." });
    }
    
              
  }


  static async updateStatus(req,res){
    try {
      const { id } = req.params; 
      const { status } = req.body; 
      
      if (typeof status !== 'string') {
        return res.status(400).json({ error: "Status must be a string." });
        }

       

        const updatedMovie = await Movie.findByIdAndUpdate(id, { status }, { new: true });

        res.status(200).json(updatedMovie);

        } catch (error) {
          console.error(error);

          res.status(500).json({ error: "Error updating the movie status." });
          
          }

  }

  static async deleteMovie(req,res){
    try {
      const { id } = req.params; // Get the movie ID from the request params
      const movie = await Movie.findByIdAndDelete(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
        }
        res.status(200).json({ message: "Movie deleted successfully." });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error deleting the movie." });
          }
  }



}

export default Movies;
