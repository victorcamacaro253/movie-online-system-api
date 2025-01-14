import userPreferencesModel from "../models/userPreferences.js";


class userPreferences{


    static async getAllUsersPreferences(req,res){
            try {

                const preferences = await userPreferencesModel.find().populate("userId").populate("favoriteActors")
                
                res.json(preferences)
                
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error fetching user preferences" });
                
            }

    }

    static async getUserPreferences(req,res){
        try {
            const { id } = req.params;
            const preferences = await userPreferencesModel.findById(id).populate("userId").populate("favoriteActors")
            if(!preferences){
                res.status(404).json({ message: "User preferences not found" })
            }
                res.json(preferences)

                
        }catch(error){
        console.error(error);
        res.status(500).json({ message: "Error fetching user preferences" });
          }
}


static async createUserPreferences(req,res){
    try {
        const { userId, preferredGenres,favoriteActors } = req.body;

        const existingPreference = await userPreferencesModel.findOne({ userId });

        if (existingPreference) {
          return res.status(400).json({ message: "Preferences for this user already exist." });
        }
  
        const preferences = new userPreferencesModel({ userId, preferredGenres,favoriteActors });

        const savedPreference = await preferences.save();

        res.status(201).json(savedPreference);


}catch(error){
    console.error(error);
    res.status(500).json({ message: "Error creating user preferences" });
}
}

 static async updateUserPreferences(req,res){
    try {
        const { id } = req.params;
        const {  preferredGenres,favoriteActors } = req.body;
        const updatedPreference = await userPreferencesModel.findByIdAndUpdate(id, { $set: { preferredGenres,favoriteActors } }, { new: true });
            if (!updatedPreference) {
                res.status(404).json({ message: "User preferences not found" });
                
                }
                res.json(updatedPreference);
                }catch(error){
                    console.error(error);
                    res.status(500).json({ message: "Error updating user preferences" });
                }

            }

            static async deleteUserPreferences(req,res){
                try {
                    const { id } = req.params;
                    const deletedPreference = await userPreferencesModel.findByIdAndDelete(id);
                    if (!deletedPreference) {
                        res.status(404).json({ message: "User preferences not found" });
                        }
                        res.json(deletedPreference);
                        }catch(error){
                            console.error(error);
                            res.status(500).json({ message: "Error deleting user preferences" });
                            }

                        }      


                        static async removeActor(req,res){
                            const {id} = req.params;
                            const {actorId} = req.body

                            try {
                                const updatePreferences = await userPreferencesModel.findByIdAndUpdate(
                                    id,
                                    { $pull:{favoriteActors: actorId}},
                                    {new: true}
                                )

                                if(!updatePreferences){
                                    res.status(404).json({message: "User preferences not found"})
                                }

                                res.status(200).json(updatePreferences)
                                
                            } catch (error) {
                                console.error(error);
                                res.status(500).json({ message: "Error removing genre" });
                                
                            }
                        }

                        static async removeGenre(req,res){
                            const{id} = req.params;
                            const {genre} = req.body

                            try {
                                const updatePreferences = await userPreferencesModel.findByIdAndUpdate(
                                    id,
                                    { $pull:{favoriteGenres: genre}},
                                    {new: true}
                                    )
                                    if(!updatePreferences){
                                        res.status(404).json({message: "User preferences not found"})
                                        }
                                        res.status(200).json(updatePreferences)

                                
                            } catch (error) {
                                console.error(error);
                                res.status(500).json({ message: "Error removing genre" });
                                
                            }
                        }

                        static async addGenre(req,res){
                            const {id} = req.params;
                            const {genre} = req.body

                            try{

                                const updatePreferences= await userPreferencesModel.findByIdAndUpdate(
                                    id,
                                    {$addToSet:{favoriteGenres:genre}},
                                    {new: true}
                                    )

                                    if(!updatePreferences){

                                        res.status(404).json({message: "User preferences not found"})
                                        }

                                        res.status(200).json(updatePreferences)


                            }catch(error){
                                console.error(error);
                                res.status(500).json({ message: "Error adding genre" });
                            }
                        }


                        static async addActor(req,res){
                            const {id} = req.params;
                            const {actorId} = req.body
                            try{
                                const updatePreferences= await userPreferencesModel.findByIdAndUpdate(
                                    id,
                                    {$addToSet:{favoriteActors:actorId}},
                                    {new: true}
                                    )
                                    if(!updatePreferences){
                                        res.status(404).json({message: "User preferences not found"})
                                        }
                                        res.status(200).json(updatePreferences)
                                        }catch(error){
                                            console.error(error);
                                            res.status(500).json({ message: "Error adding actor" });
                                            }
                                            
                        }

}

export default userPreferences;