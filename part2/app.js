const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const app = express();
const db = require("./models/db")
app.use(session({
    secret: process.env.session_secret || "default",
    resave: true, // Do not resave session if not modified
    saveUninitialized: false, // Do not store uninitialised sessions
    rolling: true, // Refresh expiry on each request
    cookie: {
        httpOnly: true, // Prevent javascript access to cookie
        maxAge: 3600000, // 1 hour expiration
        sameSite: 'Strict', // Prevent CSRF attacks
        secure: false
    }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// From Part 1 but simplified
app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Dogs;');
        console.log(JSON.stringify(rows));
        return res.json(rows);
    } catch (err) {
        console.error(err);
    }
}
);

// Export the app instead of listening here
module.exports = app;