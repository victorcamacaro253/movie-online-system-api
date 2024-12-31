import TheaterModel from "../models/theaters.js";

class Theater {

    static async getAllTheaters(req,res){
            try{

                const theaters = await TheaterModel.find();
                res.json(theaters);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error fetching theaters"})
            }
    }

    static async getTheaterById(req,res){
        const {id} = req.params
        try{
            const theater = await TheaterModel.findById(id);

            if(!theater){
                return res.status(404).json({message: "Theater not found"})
            }

            res.json(theater);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error fetching theater by id"})
                }

    }

    static async getTheaterByName(req,res){
        const {name} = req.params
        console.log(name)
        try{
            const theater = await TheaterModel.find({name});

            if(!theater){
                return res.status(404).json({message: "Theater not found"})
            }
            res.json(theater);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error fetching theater by name"})
                }
                
    }


   
static async createTheater(req, res) {
    const {
        name,
        location,
        total_auditoriums,
        capacity,
        total_employees,
        facilities,
        images,
        email,
        phone,
        opening_hours
    } = req.body;

    try {
        // Create a new theater document
        const theater = new TheaterModel({
            name,
            location,
            total_auditoriums,
            capacity,
            total_employees,
            facilities,
            images,
            email,
            phone,
            opening_hours
        });

        // Save the theater to the database
        await theater.save();

        // Respond with the created theater
        res.status(201).json({ message: "Theater created successfully", theater });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating theater", error: error.message });
    }
}


static async updateTheater (req, res) {
    const {id} = req.params;
    const {updates} = req.body;

    try {
        // Find the theater by ID
        const theater = await TheaterModel.findByIdAndUpdate(id,updates,{new:true})
        if (!theater) {
            return res.status(404).json({ message: "Theater not found" });
            }
            // Respond with the updated theater
            res.status(200).json({ message: "Theater updated successfully", theater });
            
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating theater", error: error.message });
        
    }

}

static async deleteTheater(req,res){
    const {id} = req.params;
    try{
        const theater = await TheaterModel.findByIdAndDelete(id);
        if(!theater){
            return res.status(404).json({message:"Theater not found"})
            }
            res.status(200).json({message:"Theater deleted successfully"})
            }catch(error){
                console.error(error);
                res.status(500).json({message:"Error deleting theater",error:error.message})
                }
                
}


}


export default Theater;