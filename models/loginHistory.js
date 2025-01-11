import { Schema,model } from "mongoose";

const loginHistorySchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    loginAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
    deviceInfo: {
      browser: { type: String },
      os: { type: String },
    },
    code: { type: String }
  });
  
  const LoginHistory = model("login_histories", loginHistorySchema);
  
  export default LoginHistory
  