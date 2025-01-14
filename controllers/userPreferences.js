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
}

export default userPreferences;