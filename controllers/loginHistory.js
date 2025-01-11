import LoginHistory from '../models/loginHistory.js';
import { UAParser } from 'ua-parser-js';

class loginHistory {
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
}

export default loginHistory