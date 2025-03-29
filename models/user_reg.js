import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

const SessionMessageRequestSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

//  // Verify session belongs to employee
//  const sessionData = await db.query.wellbeing_sessions.findFirst({
//     where: and(
//         eq(wellbeing_sessions.id, sessionId),
//         eq(wellbeing_sessions.employee_id, employeeId)
//     ),
// });

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