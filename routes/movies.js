import { Router } from "express";
import Movies from "../controllers/movies.js";
import upload from "../middleware/multerConfig.js";

const router = Router()


router.get('/',Movies.getAllMovies)


router.get('/playing',Movies.getMoviesCurrentlyPlaying)

router.get('/page',Movies.getPaginatedMovies)


router.get('/movie/:title',Movies.getMovieByTitle)


router.get('/genre',Movies.getMoviesByGenre)

router.get('/playingByTheater',Movies.getMoviesPlayingByTheater)


router.get('/actor/:name',Movies.getMoviesByActorName)


router.get('/actors/:id',Movies.getMoviesByActor)


router.get("/countByGenre",Movies.countMoviesByGenre);


router.get('/d/',Movies.getMoviesByYear)


router.get('/date',Movies.getMoviesByDateRange)


router.get('/status',Movies.getMoviesByStatus)


router.get('/:id',Movies.getMovieById)


router.put('/:id',Movies.updateMovie)


router.put('/status/:id',Movies.updateStatus)


router.post('/',upload.fields([{name:"poster"},{name:"images"}]),Movies.addMovie)


router.post('/addMultipleMovies',upload.fields([{name:"poster"},{name:"images"}]),Movies.addMultipleMovies)


router.delete('/:id',Movies.deleteMovie)


export default router