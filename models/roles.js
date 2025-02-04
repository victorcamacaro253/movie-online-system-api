import { Schema,model } from "mongoose";


const rolesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String},
    permissions: [{ type: Schema.Types.ObjectId, ref: "permissions" }]
    });

const Roles = model('roles',rolesSchema);

export default Roles;
