import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signin(req, res) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return res.status(400).json({ code: 1, message: 'Email and password are required' });
        }

        // const { data, error } = await supabase
        //     .from('employee')
        //     .select('e_password')
        //     .eq('email', email)
        //     .single();

        if (error || !data) {
            return res.status(400).json({ code: 1, message: 'Invalid email or password' });
        }

        const isCorrectPassword = await bcrypt.compare(password, data.e_password);

        if (!isCorrectPassword) {
            return res.status(400).json({ code: 1, message: 'Invalid password' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing in environment variables');
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ code: 0, message: 'Signed in successfully', token: token });

    } catch (error) {
        console.error('Sign-in error:', error);
        return res.status(400).json({ code: 1, message: error.message });
    }
}
