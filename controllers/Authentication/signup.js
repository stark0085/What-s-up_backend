import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../../models/user_reg.js";

export default async function signup(req, res) {

    const genHasPass = async (password) => {
        return await bcrypt.hash(password, 10)
    }

    const validateEmail = (email) => {
        return validator.isEmail(email)
    }

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ code: 1, message: "Name, email and password are required" })
        }

        const checkEmail = validateEmail(email)
        if (!checkEmail) {
            return res.status(400).json(
                { message: "Enter a valid Email" },);
        }

        const emailData = await User.findOne({ email: email }).exec();
        if (emailData) {
            return res.status(400).json({ code: 1, message: 'Email is already registered'});
        }

        const hashedPassword = await genHasPass(password)

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }
        
        const token = jwt.sign(
            { email, name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TIME_TO_LIVE || "24h"}
        );

        const newUser = new User({
            email: email,
            name:  name,
            password: hashedPassword
        });

        await newUser.save();
        const savedUser = await newUser.save();

        return res.status(200).json({ code: 0, message: "Signed up successfully", token: token });

    } catch (error) {
        return res.status(500).json({ code: 1, error: error, message: "Request Timed Out" });
    }
}
