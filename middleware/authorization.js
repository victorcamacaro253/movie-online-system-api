import rolesModel from '../models/roles.js';


// Middleware to check permissions and roles
export const checkAccess = (requiredPermission, allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Assume the user's role is stored in req.user.role (e.g., from JWT)
            const userRole = req.user.role;

            if (!userRole) {
                return res.status(403).json({ error: 'User role not found' });
            }

            // Check if the user's role is in the list of allowed roles for the endpoint
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: 'Role not authorized for this endpoint' });
            }

            // Fetch the role from the database
            const role = await rolesModel.findOne({ name: userRole }).populate('permissions');

            if (!role) {
                return res.status(403).json({ error: 'Role not found' });
            }

            // Extract permission names from the role's permissions
            const permissionNames = role.permissions.map(permission => permission.name);

            // Check if the required permission is in the user's role permissions
            if (!permissionNames.includes(requiredPermission)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

              // For managers, ensure they have a theaterId and it matches the requested theater
              if (user.role === 'manager') {
                const theaterId = req.params.theaterId || req.body.theaterId;
                if (!theaterId) {
                    return res.status(400).json({ error: 'Theater ID is required' });
                }

                if (!user.theaterId) {
                    return res.status(403).json({ error: 'Manager is not assigned to any theater' });
                }

                if (user.theaterId !== theaterId) {
                    return res.status(403).json({ error: 'You are not authorized to manage this theater' });
                }
            }

            // User has the required permission and role, proceed to the next middleware/route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}