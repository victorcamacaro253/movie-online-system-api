import { Schema, model } from "mongoose";
import Actor from "./actors.js"; // Import the Actor model


const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String], // Array de cadenas
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    producers: {
      type: [String], // Array de cadenas
      required: true,
    },
    cast: [{
      type: Schema.Types.ObjectId,
      ref: "Actor", // Reference to the Actor model
      required: true,
    }],

    runtime: {
      type: Number, // En minutos
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
    max: 10,
    },
    ageRating: {
    type: String,
    required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    trailer: {
      type: String, // Ruta al archivo de video del tráiler
    },
    poster: {
      type: String, // Ruta a la imagen del póster
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["playing", "upcoming", "completed","Released"], // El estado puede ser uno de estos valores
      required: true,
    },
  },
  {
    timestamps: true, // Agrega automáticamente los campos createdAt y updatedAt
  }
);

// Crear el modelo
const Movie = model("movies", movieSchema);

export default Movie;