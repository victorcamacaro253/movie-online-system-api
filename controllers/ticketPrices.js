import TicketPriceModel from "../models/ticketPrices.js";

class TicketPrice {

    static async getTicketPrices(req, res) {
        try {
            const ticketPrices = await TicketPriceModel.find();
            return res.status(200).json({ ticketPrices });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getTicketPriceById(req, res) {
        try {
            const {id} = req.params;
            const ticketPrice = await TicketPriceModel.findById(id);
            if (!ticketPrice) {
                return res.status(404).json({ message: `Ticket Price with id ${id} not found` });
            }
            return res.status(200).json({ ticketPrice });
            } catch (error) {
            return res.status(500).json({ error: error.message });
            }
            }

            static async updateTicketPrice(req, res) {
                try {
                    const { id } = req.params;  
                   const {type,price}= req.body;
                    const ticketPrice = await TicketPriceModel.findByIdAndUpdate({
                        _id: id
                    }, {
                        type,
                        price
                    }, { new: true });
                    if (!ticketPrice) {
                        return res.status(404).json({ message: `Ticket Price with id ${id} not found` });
                    }
                    return res.status(200).json({ ticketPrice });
                }
                
                catch (error) {
                    return res.status(500).json({ error: error.message });
                }
                    
            }

            static async createTicket(req,res){
                try{
                    const {type,price}= req.body;
                    const ticketPrice = await TicketPriceModel.create({
                        type,
                        price
                    });
                    return res.status(201).json({ ticketPrice });
                    }
                    catch (error) {
                        return res.status(500).json({ error: error.message });
                    }
                    

            }
        }

export default TicketPrice