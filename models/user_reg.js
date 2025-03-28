import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

const UserSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"] //use zod 
    },
    token : {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: String, 
        required: true,
        unique: false
    }
})
const User = model('user', UserSchema)

export default User;