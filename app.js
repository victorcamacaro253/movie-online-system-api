import express,{ json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import Routes from "./routes/index.js";
import http from 'http';
import { setupWebSocket } from './services/webSocket.js'; // Importa la función para configurar WebSocket
import morgan from "morgan";
import helmet from 'helmet';
import './jobs/scheduler.js'
import cookieParser from "cookie-parser";

// Load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

const server = http.createServer(app);


setupWebSocket(server);


//app.use(cors())

app.use(
  cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true, // Allow cookies to be sent
  })
);

app.use(helmet());

app.use(cookieParser()); // This will parse the cookies and populate req.cookies


app.use(morgan('dev'))
// Middleware
app.use(json());

app.disable('x-powered-by')


app.use(Routes)



app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})




// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
