import express from 'express';
import mysql from 'mysql2';
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT_MYSQL
});

const server = http.createServer(app);

con.connect(function (err) {
    if (err) throw err;
    else {
        server.listen(process.env.DB_PORT_MYSQL, () => {
            console.log(`API listening on PORT ${process.env.DB_PORT_MYSQL} `)
        })
    }
});

con.ping((err) => {
    if (err) console.error("MySQL connection lost:", err);
    else console.log("MySQL is active");
});

app.use((req, res, next) => {
    con.ping((err) => {
        if (err) {
            return res.status(503).json({ error: "Database not connected yet" });
        }
        next();
    });
});

mongoose.connect(process.env.DB_dbURI,)
    .then((result) => {
        console.log("Connected to database");
        app.listen(process.DB_PORT_MONGO, () => console.log("Welcome to GC Backend"));
        console.log(`Server started at port ${process.env.DB_PORT_MONGO}`);
    })
    .catch(err => {
        console.log(err);
    })

app.get('/', (req, res) => {
    try {
        res.send("Server is running and database is connected!");
    } catch (err) {
        res.status(500).json({ code: -1, message: 'Internal server error' });
    }
})

// app.use(sqlrouter)
// app.use(authrouter)
app.use(function (req, res) {
    res.status(404).json({ code: 1, message: "ERROR 404! Page not Found, Check the url" })
})
export { con };