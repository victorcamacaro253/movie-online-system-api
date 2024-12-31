import express,{ json } from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import Routes from "./routes/index.js";
import morgan from "morgan";

// Load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

app.use(morgan('dev'))
// Middleware
app.use(json());

app.use(Routes)



app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
