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

    static async getTheatersByCity(req,res){
        const {city} = req.params
        console.log(city)
        try{
            const theaters = await TheaterModel.find({"location.city":{$regex:city,$options:"i"}});

            if(!theaters){
                return res.status(404).json({message: "Theaters not found"})
            }

            res.json(theaters);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error fetching theaters by city"})
                }
                
    }


    static async getPagedTheaters(req,res){
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

        try {
            const theaters = await TheaterModel.find().skip((page - 1) * limit).limit(limit *1).exec();

            const count = await TheaterModel.countDocuments();
            res.json({ theaters, 
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching theaters", error: error.message });
        }

    }

    static async getTheatersByMovie(req, res) {
        const { movieId } = req.params;
        try {
            const theaters = await TheaterModel.find({ 'movies.showing': movieId });
    
            if (!theaters.length) {
                return res.status(404).json({ message: "No theaters found for this movie" });
            }
    
            res.json(theaters);
        } catch (error) {
            console.error("Error in getTheatersByMovie:", error);
            res.status(500).json({ message: "Error fetching theaters by movie" });
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