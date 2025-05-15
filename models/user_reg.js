import { Schema, model } from "mongoose";
import pkg from 'validator';
const { isEmail } = pkg;

const UserSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email!"]
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }
})
const User = model('user', UserSchema, 'What-s-up-Users')

export default User;