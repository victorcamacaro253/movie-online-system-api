import { Router } from "express";
import TicketPrice from "../controllers/ticketPrices.js";


const router = Router();

router.get("/",TicketPrice.getTicketPrices);

router.get("/:id",TicketPrice.getTicketPriceById);

router.put("/:id",TicketPrice.updateTicketPrice);

router.post("/",TicketPrice.createTicket);


export default router;