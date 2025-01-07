import userModel from "../models/users.js"

class User {

    static async getAllUsers(req,res){
        try {

            const users= await userModel.find()

            res.json(users)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error fetching users"})

            
        }
    }

    static async getUserById(req,res){

        try {
            const {id} = req.params

            const user = await userModel.findById(id)
            if(user.length===0){
                res.status(404).json({message: "User not found"})
            }
            res.json(user)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error fetching user"})

            
        }
    }


    static async getUserByUsername(req,res){
        try {
            const {username} = req.params
            const user = await userModel.findOne({username})
            if(user.length===0){
                res.status(404).json({message: "User not found"})
                }

                res.json(user)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Error fetching user"})
    }
}


static async getUserByEmail(req,res){
    const {email}= req.query
  try{

    const user = await userModel.findOne({email})
    if(user.length===0){
        res.status(404).json({message: "User not found"})
        }
        res.json(user)
  }catch(error){
    console.log(error)
    res.status(500).json({message: "Error fetching user"})
  }
}


static async getUserByPersonalID(req,res){
    const {personalID}= req.query

    try{
        const user = await userModel.findOne({personalID})
        if(user.length===0){
            res.status(404).json({message: "User not found"})
            }
            res.json(user)
            }catch(error){
                console.log(error)
                res.status(500).json({message: "Error fetching user"})
            }
}

 static async getAactiveUsers(req,res){
    try{
        const users = await userModel.find({status:'active'})
        res.json(users)
        }catch(error){
            console.log(error)
            res.status(500).json({message: "Error fetching users"})
            }
 }

}

export default User;