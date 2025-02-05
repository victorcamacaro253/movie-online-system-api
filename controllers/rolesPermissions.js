import rolesModel from '../models/roles.js';
import permissionsModel from '../models/permissions.js';


class RolesPermissions {
    static async getAllRolesPermissions(req,res){
        try {
            const rolesPermissions = await rolesModel.find().
            populate("permissions", "name -_id");
            res.status(200).json(rolesPermissions);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    static async getRolesById(req,res){
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "Id is required"});
        }
        try {
            const rolesPermissions = await rolesModel.findById(id);
            if(!rolesPermissions) return res.status(404).json({message: "Roles not found"});
            res.status(200).json(rolesPermissions);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    static getPermissions(req,res){
        
        try {
            const permissions = permissionsModel.find();
            res.status(200).json(permissions);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }


    static async getPermissionById(req,res){
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "Id is required"});
        }

        try {
            const permissions = await permissionsModel.findById(id);
            if(!permissions) return res.status(404).json({message: "Permissions not found"});
            res.status(200).json(permissions);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }


    static async createPermission(req, res) {
        const { name, description } = req.body;
        if (!name ) {
            return res.status(400).json({ message: "Name is required." });
        }
        try {
            const newPermissions = await permissionsModel.create({ name, description });
            res.status(201).json(newPermissions);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }


    static async updatePermission(req, res) {

        const { id } = req.params;
        const { name, description } = req.body;
        if (!id) {
            return res.status(500).json({ message: "Id is required" });
            }
            try {
                const permissions = await permissionsModel.findByIdAndUpdate(id, { name, description }, { new: true });
                if (!permissions) return res.status(404).json({ message: "Permissions not found"
                    });
                    res.status(200).json(permissions);
                    }
                    catch (error) {
                        res.status(500).json({ message: error.message });
                        }
                        }

    static async deletePermission(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
            }
            try {
                await permissionsModel.findByIdAndDelete(id);
                res.status(200).json({ message: "Permissions deleted successfully" });
                }
                catch (error) {
                    res.status(500).json({ message: error.message });
                    }
                    }

    static async createRole(req, res) {
        const { name, permissions } = req.body;
    
        // Validate input
        if (!name || !permissions || !Array.isArray(permissions)) {
          return res.status(400).json({ message: "Role name and permissions array are required." });
        }
    
        try {
          // Check if the role already exists
          const existingRole = await rolesModel.findOne({ name });
          if (existingRole) {
            return res.status(404).json({ message: "Role already exists." });
          }
    
          // Validate permissions (ensure all permission IDs exist)
          const validPermissions = await permissionsModel.find({
            _id: { $in: permissions }
          });
    
          if (validPermissions.length !== permissions.length) {
            return res.status(500).json({ message: "One or more permissions are invalid." });
          }
    
          // Create the new role
          const newRole = new rolesModel({
            name,
            permissions: permissions // Array of permission ObjectIds
          });
    
          await newRole.save();
    
          res.status(201).json(newRole);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      
  static async updateRole(req, res) {
    const { id } = req.params;
    const { name, permissions } = req.body;

    if (!id) return res.status(400).json({ message: "Role ID is required." });

    try {
      const role = await rolesModel.findById(id);
      if (!role) return res.status(404).json({ message: "Role not found." });

      // Update name if provided
      if (name) {
        const existingRole = await rolesModel.findOne({ name });
        if (existingRole && existingRole._id.toString() !== id) {
          return res.status(404).json({ message: "Role name already exists." });
        }
        role.name = name;
      }

      // Update permissions if provided
      if (permissions) {
        if (!Array.isArray(permissions)) {
          return res.status(400).json({ message: "Permissions must be an array." });
        }

        // Validate permission IDs
        const validPermissions = await permissionsModel.find({ _id: { $in: permissions } });
        if (validPermissions.length !== permissions.length) {
          return res.status(400).json({ message: "One or more permissions are invalid." });
        }

        role.permissions = permissions;
      }

      await role.save();
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteRole(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Role ID is required." });

    try {
      const role = await rolesModel.findByIdAndDelete(id);
      if (!role) return res.status(404).json({ message: "Role not found." });

      res.status(200).json({ message: "Role deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  
  static async addPermissionsToRole(req, res) {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!id || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Role ID and permissions array are required." });
    }

    try {
      // Validate permissions exist
      const validPermissions = await permissionsModel.find({ _id: { $in: permissions } });
      if (validPermissions.length !== permissions.length) {
        return res.status(400).json({ message: "One or more permissions are invalid." });
      }

      const role = await rolesModel.findByIdAndUpdate(
        id,
        { $addToSet: { permissions: { $each: permissions } } }, // Avoid duplicates
        { new: true }
      );

      if (!role) return res.status(404).json({ message: "Role not found." });

      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  
  static async removePermissionsFromRole(req, res) {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!id || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Role ID and permissions array are required." });
    }

    try {
      const role = await rolesModel.findByIdAndUpdate(
        id,
        { $pull: { permissions: { $in: permissions } } }, // Remove specified permissions
        { new: true }
      );

      if (!role) return res.status(404).json({ message: "Role not found." });

      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default RolesPermissions;