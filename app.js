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
import './controllers/socialMediaAuth.js';  // Asegúrate de que se configure passport
import limiter from './middleware/rateLimiter.js';
import session from 'express-session';
import passport from 'passport';




// Load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

const server = http.createServer(app);


// Configuración de la sesión
app.use(session({
  secret: 'victorcamacaro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Cambia a true en producción con HTTPS
}));

// Inicializa passport y sesiones
app.use(passport.initialize());
app.use(passport.session());


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

app.use(limiter);


app.use(Routes)



app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})




// Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
