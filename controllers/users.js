import userModel from "../models/users.js"
import { hash,compare } from "bcrypt"
import AdminManagerModel from "../models/adminManager.js"

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

 static async createUser(req,res){
    const {fullname,username,email,password,phone,personalID,cards,birthdate} = req.body

    if(!fullname || !username || !email || !phone){
       return res.status(400).json({message: "Please fill all fields"})

    }
    console.log(password)

    if(password.length < 7){
       return res.status(400).json({message: "Password must be at least 8 characters long"})
    }
/*
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}$/; // Example regex for strong passwords
if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password must include uppercase, lowercase, and a number." });
}
    */

    
    try{

        const duplicateFields = await userModel.findOne({
            $or: [
                { username },
                { email },
                { phone },
                { personalID }
            ]
        });
        
        if (duplicateFields) {
            if (duplicateFields.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (duplicateFields.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (duplicateFields.phone === phone) {
                return res.status(400).json({ message: "Phone number already exists" });
            }
            if (duplicateFields.personal_ID === personalID) {
                return res.status(400).json({ message: "Personal ID already exists" });
            }
        }
        

        const hashedPassword = await hash(password, 10);

        const profile_image = req.file ? `/uploads/users/${req.file.filename}` : null;
        console.log(profile_image)

        const user = new userModel({
            fullname,
            username,
            email,
            password: hashedPassword,
            phone,
            personalID,
            cards,
            profile_image,
            birthdate
            })

            await user.save()

            const { password: _, ...userWithoutPassword } = user.toObject();


            
           res.status(201).json(userWithoutPassword);


            }catch(error){
                console.log(error)
                res.status(500).json({message: "Error creating user"})
                }



 }
 static async createUsers(req, res) {
    const { users } = req.body;

    if (!users || !Array.isArray(users)) {
        return res.status(400).json({ message: "Invalid input, 'users' must be an array" });
    }

    const errors = []; // Collect errors for duplicate or invalid users
    const usersToInsert = []; // Valid users to be inserted

    try {
        // Extract all potential duplicate fields from the input
        const allUsernames = users.map((u) => u.username);
        const allEmails = users.map((u) => u.email);
        const allPhones = users.map((u) => u.phone);
        const allPersonalIDs = users.map((u) => u.personalID);

        // Perform a single query to check for duplicates
        const existingUsers = await userModel.find({
            $or: [
                { username: { $in: allUsernames } },
                { email: { $in: allEmails } },
                { phone: { $in: allPhones } },
                { personalID: { $in: allPersonalIDs } },
            ],
        });

        // Group existing users by their fields for quick lookup
        const existingUserMap = new Map();
        for (const existingUser of existingUsers) {
            existingUserMap.set(existingUser.username, "username");
            existingUserMap.set(existingUser.email, "email");
            existingUserMap.set(existingUser.phone, "phone");
            existingUserMap.set(existingUser.personal_ID, "personalID");
        }

        // Process each user
        for (const user of users) {
            const { fullname, username, email, password, phone, personalID, cards, birthdate } = user;

            // Check for duplicates
            if (existingUserMap.has(username)) {
                errors.push({ username, message: "Username already exists" });
                continue;
            }
            if (existingUserMap.has(email)) {
                errors.push({ email, message: "Email already exists" });
                continue;
            }
            if (existingUserMap.has(phone)) {
                errors.push({ phone, message: "Phone number already exists" });
                continue;
            }
            if (existingUserMap.has(personalID)) {
                errors.push({ personalID, message: "Personal ID already exists" });
                continue;
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);

            // Handle profile image (single file handling)
            const profile_image = req.file ? `/uploads/users/${req.file.filename}` : null;

            // Add valid user to the array
            usersToInsert.push({
                fullname,
                username,
                email,
                password: hashedPassword,
                phone,
                personal_ID:personalID,
                profile_image,
                cards,
                birthdate,
            });
        }

        // Insert valid users into the database
        if (usersToInsert.length > 0) {
            const newUsers = await userModel.insertMany(usersToInsert);
            return res.status(201).json({
                message: "Users created successfully",
                newUsers,
                errors, // Include any errors for skipped users
            });
        }

        // If no users were valid, return errors
        return res.status(400).json({
            message: "No users were created due to validation errors",
            errors,
        });
    } catch (error) {
        console.error("Error creating users:", error);
        return res.status(500).json({ message: "Error creating users", error: error.message });
    }
}



}

export default User;