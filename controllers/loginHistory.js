import LoginHistory from '../models/loginHistory.js';
import { UAParser } from 'ua-parser-js';

class loginHistory {



   static async getAllLoginRecords(req,res){
    try {
        const history = await LoginHistory.find().populate("user_id", "fullname username email");
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching login history" });
    }
   }

   static async getUserLoginHistory(req, res) {
    try {
        const { id } = req.params;
        const userHistory = await LoginHistory.find({ user_id: id }).sort({ loginAt: -1 })
        .populate("user_id", "fullname username email");

        if(!userHistory || userHistory.length === 0) {
            return res.status(404).json({ message: "User login history not found" });
        }

        const total_record= userHistory.length

        res.json({
            total_record,
            userHistory});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user's login history" });
    }
}



    static async addUserLoginRecord(req,userId,randomCode){
        try {
            const ipAddress= req.headers["x-forwarded-for"] || req.ip;

            const userAgent= req.headers["user-agent"] || "Unknown";
            const parser = new UAParser(userAgent)
            const deviceInfor = {
                    browser: parser.getBrowser().name || "Unknown",
                    os: parser.getOS().name || "Unknown OS",
            }

            const loginRecord = new LoginHistory({
                user_id: userId,
                ipAddress,
                userAgent: userAgent,
                deviceInfo: deviceInfor,
                code: randomCode
            })

            console.log(loginRecord)

          const userLogin= await  loginRecord.save()

            return loginRecord
        } catch (error) {
            console.error(error);
            throw new Error("Failed to record login history");

            
        }

    }

    static async deleteLoginRecord(req, res) {
        try {
            const { id } = req.params;
            const deleteRecord = await LoginHistory.findByIdAndDelete(id);

            if(!deleteRecord){
                return res.status(404).json({ message: "Record not found" });
            }

            res.json({ message: "Login record deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting login record" });
        }
    }
    
    static async deleteUserLoginHistory(req, res) {
        try {
            const { userId } = req.params;
            await LoginHistory.deleteMany({ user_id });
            res.json({ message: "All login records for the user deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting user's login history" });
        }
    }
    
}

export default loginHistory