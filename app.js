import express,{ json } from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import Routes from "./routes/index.js";
import http from 'http';
import { setupWebSocket } from './services/webSocket.js'; // Importa la función para configurar WebSocket
import morgan from "morgan";
import cors from "cors";
import './jobs/scheduler.js'

// Load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

const server = http.createServer(app);


setupWebSocket(server);


app.use(cors())

app.use(morgan('dev'))
// Middleware
app.use(json());

app.use(Routes)



app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})




// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
