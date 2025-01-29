import rateLimit  from "express-rate-limit";
 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,// 15 minutos
    max:100,
    message: 'Too many requests from this IP, please try again later',
    headers:true,
});

export default limiter;