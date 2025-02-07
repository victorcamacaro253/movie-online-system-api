import AdminManagerModel from "../models/adminManager.js"
import rolesModel from "../models/roles.js"
import { hash,compare } from "bcrypt"



class AdminManager {

  /*  static async getAllAdmin(req,res){
        try {
            const admin = await AdminManagerModel.find().populate('role')
            res.json(admin)
            } catch (error) {   
                res.status(500).json({ message: error.message })
                }
                }

                */

                static async getAllAdmin(req, res) {
                    try {
                        // Get all users and populate the role details
                        const admins = await AdminManagerModel.find().populate("roleId");
            console.log(admins)
                        // Filter users where role name is "admin"
                        const adminUsers = admins.filter(user => user.roleId.name === "admin");
            
                        res.json(adminUsers);
                    } catch (error) {
                        res.status(500).json({ message: error.message });
                    }
                }


                static async getAllManagers(req, res) {
                    try {
                        // Get all users and populate the role details
                        const managers = await AdminManagerModel.find().populate("roleId");
            
                        // Filter users where role name is "manager"
                        const managerUsers = managers.filter(user => user.roleId.name === "manager");
            
                        res.json(managerUsers);
                    } catch (error) {
                        res.status(500).json({ message: error.message });
                    }
                }
            
                static async getAdminById(req, res) {
                    try {
                        const { id } = req.params;
                        const admin = await AdminManagerModel.findById(id).populate("roleId");
            
                        if (!admin) {
                            return res.status(404).json({ message: "Admin not found" });
                        }
            
                        if (admin.roleId.name !== "admin") {
                            return res.status(400).json({ message: "User is not an admin" });
                        }
            
                        res.json(admin);
                    } catch (error) {
                        res.status(500).json({ message: "Error retrieving admin", error: error.message });
                    }
                }
            
                static async getManagerById(req, res) {
                    try {
                        const { id } = req.params;
                        const manager = await AdminManagerModel.findById(id).populate("roleId");
            
                        if (!manager) {
                            return res.status(404).json({ message: "Manager not found" });
                        }
            
                        if (manager.roleId.name !== "manager") {
                            return res.status(400).json({ message: "User is not a manager" });
                        }
            
                        res.json(manager);
                    } catch (error) {
                        res.status(500).json({ message: "Error retrieving manager", error: error.message });
                    }
                }
            

static async createAdminManager(req,res){
    try {
        const {  username,password,roleId,theaterId} = req.body;

        const role = await rolesModel.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if(!['admin','manager'].includes(role.name)){
            return res.status(400).json({ message: "Invalid role" });
            }

            // Validate theaterId for managers
        if (role.name === 'manager' && !theaterId) {
            return res.status(400).json({ error: 'Theater ID is required for managers' });
        }

        // Ensure admins don't have a theaterId
        if (role.name === 'admin' && theaterId) {
            return res.status(400).json({ error: 'Admins cannot have a theater ID' });
        }

        const existingUser= await AdminManagerModel.findOne({
            username,
            roleId
        })
        console.log(existingUser)
        if(existingUser){
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = new AdminManagerModel({
            username,
            password: hashedPassword,
            roleId,
            theaterId: role.name === 'manager' ? theaterId : undefined, // Only include theaterId for managers

            });

            await newUser.save()

            res.status(201).json(newUser)
} catch (error) {
    console.error("Error creating admin/manager:", error);
    res.status(500).json({ message: "Error creating admin/manager", error: error.message });
}

 

}




    // Delete Admin
    static async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            const user = await AdminManagerModel.findById(id).populate("roleId");

            if (!user) {
                return res.status(404).json({ message: "Admin not found" });
            }

            if (user.roleId.name !== "admin") {
                return res.status(400).json({ message: "User is not an admin" });
            }

            await AdminManagerModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Admin deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting admin", error: error.message });
        }
    }

    // Delete Manager
    static async deleteManager(req, res) {
        try {
            const { id } = req.params;
            const user = await AdminManagerModel.findById(id).populate("roleId");

            if (!user) {
                return res.status(404).json({ message: "Manager not found" });
            }

            if (user.roleId.name !== "manager") {
                return res.status(400).json({ message: "User is not a manager" });
            }

            await AdminManagerModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Manager deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting manager", error: error.message });
        }
    }




}

export default AdminManager;