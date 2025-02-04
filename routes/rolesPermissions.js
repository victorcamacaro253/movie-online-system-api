import { Router } from "express";
import RolesPermissions from '../controllers/rolesPermissions.js'

const router = Router()




router.get('/',RolesPermissions.getAllRolesPermissions)

router.get('/:id',RolesPermissions.getRolesById)

router.get('/permissions',RolesPermissions.getPermissions)

router.get('/permissions/:id',RolesPermissions.getPermissionById)

router.post('/',RolesPermissions.createRole)

router.post('/permissions',RolesPermissions.createPermission)

router.put('/:id',RolesPermissions.updateRole)

router.put('/permissions/:id',RolesPermissions.updatePermission)

router.delete('/permissions/:id',RolesPermissions.deletePermission)

router.delete('/:id',RolesPermissions.deleteRole)





export default router;