import { connect } from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de instalar dotenv con `npm install dotenv`


const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;


/*
import mongoose from 'mongoose';

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/movie_booking_system'; // Change this URI as needed

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
*/
