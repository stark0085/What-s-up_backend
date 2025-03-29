import User from "../models/user.cjs"

const getCurrTime = ()=>{
    new Date().toLocaleTimeString()
    var d = new Date()
    return d.toTimeString().slice(0,8)
}

const createToken = (email)=>{
    var first3 = email.slice(0,3)
    var last3 = email.slice(-3)
    const token = first3 + "&#$" + last3
    return Buffer.from(token).toString("base64")
}

export const access_token_post = async (req, res)=>{
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ code: 1, error: "Email is required" });
    }
    try {
        const token = createToken(email)
        const createdAt = getCurrTime()
        const user = await User.create({email, token, createdAt})
        return res.status(200).json({ code: 0, message: "User Added Successfully", user: user});
    } catch (error) {
        res.status(500).json({ code: -1, message: 'Internal server error', error: error});
    }
}

const getTimeDifference = (oldTime) => {
    const now = new Date();  // Current time
    const [hours, minutes, seconds] = oldTime.split(":").map(Number);
    
    const oldDate = new Date();
    oldDate.setHours(hours, minutes, seconds, 0);
    
    const diffMs = now - oldDate;
    
    const diffSeconds = Math.floor((diffMs / 1000) % 60);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    
    return { hours: diffHours, minutes: diffMinutes, seconds: diffSeconds };
};

export async function access_token_get(req, res) {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ code: 1, message: "Email is required" });
    }
    var d = getCurrTime()

    try{
        const data = await User.find({email: email})
        const Dt = getTimeDifference(data[0].createdAt)
        if(Dt.hours === 0 && Dt.minutes <1 && Dt.seconds<60)
            res.status(200).json({ code: 0, message: "Authorization successful"});
        else{
            const userId = data[0]._id.toString();
            const itemDeleted = await User.deleteOne({ _id: userId });
            res.status(200).json({code: 5, message: "Token Expired, Log in again to Continue"})
        }
    } catch (error) {
        res.status(500).json({ code: -1, message: 'Internal server error', error: error});
    }
}