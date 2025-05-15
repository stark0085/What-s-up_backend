import express from 'express';
import mysql from 'mysql2';
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
// import chatsrouter from './routes/DB_Routes/sqlRoutes';
import authrouter from './routes/authRoutes/authRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT_MYSQL
});

async function initServer() {
    try { 
        await mongoose.connect(process.env.DB_mongoURI);
        console.log("Connected to MongoDB");

        con.connect((err) => {
            if (err) throw err;
            console.log("Connected to MySQL");

            server.listen(process.env.SERVER_PORT || 3000, () => {
                console.log(`Server running on http://localhost:${process.env.SERVER_PORT || 5000}`);
            });

            con.ping((err) => {
                if (err) console.error("MySQL ping failed:", err);
                else console.log("MySQL is active");
            });
        });

    } catch (err) {
        console.error("Failed to start server:", err);
    }
}

initServer();

io.on('connection', (socket) => {
    console.log('A User connected');

    socket.on('disconnect', () => console.log('User disconnected'));
});

app.use((req, res, next) => {
    con.ping((err) => {
        if (err) {
            return res.status(503).json({ error: "Database not connected yet" });
        }
        next();
    });
});

app.get('/', (req, res) => {
    res.send("Server is running and databases are connected!");
});

// app.use(chatsrouter)
app.use('/auth', authrouter);

app.use((req, res) => {
    res.status(404).json({ code: 1, message: "ERROR 404! Page not Found, Check the URL" });
});

export { con };