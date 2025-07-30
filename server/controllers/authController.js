import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername, createUser } from '../dal/usersSupabaseDAL.js';
import { config } from 'dotenv';
config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '1h';

export async function registerOrLogin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        let user = await getUserByUsername(username);

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await createUser(username, hashedPassword);
            if (!newUser) {
                console.error('Failed to create new user in DB (createUser returned null).');
                return res.status(500).json({ message: 'Error creating new user. Please check server logs.' });
            }
            user = newUser;
            console.log(`User ${username} registered successfully.`);
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(403).json({ message: 'Incorrect password.' });
            }
            console.log(`User ${username} logged in successfully.`);
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_TIME }
        );

        res.json({ message: 'Login successful!', token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error('Error in register/login process:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
}