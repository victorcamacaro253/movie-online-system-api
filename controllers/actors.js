import Actor from '../models/actors.js'


class Actors{

    static async getAllActors(req,res) {
        try {

            const actors = await Actor.find();

        res.json(actors)

        } catch (error) {

                return error;
         }

        }

        static async getActorById(req,res){
            const {id} = req.params;
            try {
                
                const actor = await Actor.findById(id);
                if (!actor) {
                    return res.status(404).json({ message: "Actor not found" });
                    }
                    res.json(actor);
                    } catch (error) {
                        return error;
                        }

        }

        static async getActorByName(req,res){
            const {name} = req.params;
            try {
                const actor = await Actor.findOne({name});
                if (!actor) {
                        
                    return res.status(404).json({ message: "Actor not found" });

                    }

                    res.json(actor);

                    } catch (error) {
                        return error;
                      
                   }

        }

        static async createActor(req,res){
            const {name,image} = req.body;
            try {
                const actor = await Actor.create({name,image});
                res.json(actor);
                } catch (error) {
                    return error;
                    }
                    }


                    static async addMultipleActors(req, res) {
                        const { actors } = req.body;
                      
                        try {
                          // Validate the input
                          if (!Array.isArray(actors) || actors.length === 0) {
                            return res.status(400).json({ message: "Actors array is required" });
                          }
                      
                          // Prepare actor names and ensure they're trimmed
                          const actorNames = actors.map(actor => actor.name.trim());
                      
                          // Case-insensitive search for existing actors
                          const existingActors = await Actor.find({
                            name: { $in: actorNames.map(name => new RegExp(`^${name}$`, 'i')) },
                          });
                      
                          const existingNames = existingActors.map(actor => actor.name.toLowerCase());
                      
                          // Filter out actors that already exist (case-insensitively)
                          const newActors = actors.filter(
                            actor => !existingNames.includes(actor.name.trim().toLowerCase())
                          );
                      
                          // Validate new actors
                          for (const actor of newActors) {
                            if (!actor.name) {
                              return res.status(400).json({ message: "Actor name is required" });
                            }
                          }
                      
                          // Insert only new actors
                          if (newActors.length > 0) {
                            await Actor.insertMany(newActors);
                          }
                      
                          // Return the result
                          res.json({
                            message: "Actors processed successfully",
                            added: newActors,
                            skipped: existingActors,
                          });
                        } catch (error) {
                          console.error("Error while adding actors:", error);
                          res.status(500).json({ message: "Internal server error", error });
                        }
                      }
                      
                    static async updateActor(req,res){
                        const {id} = req.params;
                        const updates = req.body;
                        console.log(updates)
                        try {
                            const actor = await Actor.findByIdAndUpdate(id,updates,{new:true});

                            if (!actor) {
                                return res.status(404).json({message:"Actor Not Found"})
                                
                            }
                            res.json(actor);
                            } catch (error) {
                                return error;
                                }



                   }

                   static async deleteActor(req,res){
                    const {id} = req.params;
                    try {
                        await Actor.findByIdAndDelete(id);

                        res.json({ message: "Actor deleted successfully" });

                        } catch (error) {

                         return error;
                        
                        }

                          }

}

export default Actors