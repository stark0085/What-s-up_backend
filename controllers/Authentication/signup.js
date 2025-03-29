import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export async function signup(req, res) {

    const genHasPass = async (password) => {
        return await bcrypt.hash(password, 10)
    }

    const validateEmail = (email) => {
        return validator.isEmail(email)
    }

    try {
        const body = await req.json();
        const { name, email, password} = body;

        if (!name || !email || !password || !role || !id) {
            return res.status(400).json({ code: 1, message: "Name, email and password are required" })
        }

        const checkEmail = validateEmail(email)
        if (!checkEmail) {
            return res.status(400).json(
                { message: "Enter a valid Email" },);
        }

        // const { data: emailData, error: emailError } = await supabase
        //   .from('employee')
        //   .select('email')
        //   .eq('email', email)
        //   .single();

        if (emailData?.email === email) {
            return res.status(400).json({ code: 1, message: 'Email is already registered', emailError });
        }

        // const { data: IdData, error: IdError } = await supabase
        //     .from('employee')
        //     .select('id')
        //     .eq('id', id)
        //     .single();

        const hashedPassword = await genHasPass(password)

        const { error } = await supabase
            .from('employee')
            .insert({ name: name, email: email, password: hashedPassword, role: role, id: id })

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ code: 0, message: "Signed up successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(400).json(
            { message: error.message },
            { status: 500 });
    }
}
