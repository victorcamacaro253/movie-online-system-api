import { Schema,model} from 'mongoose';

const permissionsSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String}
    });
    const Permission = model('permissions', permissionsSchema);

export default Permission;