// ticketPrice.js (Ticket Price Schema)
import { Schema, model } from "mongoose";

const ticketPriceSchema = new Schema({
    type: { type: String, required: true, enum: ['standard', 'vip', 'child', 'student','Adult'] }, // Different ticket types
    price: { type: Number, required: true }, // Price for this ticket type
});

const TicketPrice = model('ticket_prices', ticketPriceSchema);

export default TicketPrice;
