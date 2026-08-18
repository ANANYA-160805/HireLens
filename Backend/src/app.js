require('dotenv').config();
const express = require('express');
const connectToDB = require('./config/database');

connectToDB();

const app = express();

app.use(express.json());

/* require all the routes */
const authRouter = require('./routes/auth.routes');


/* use all the routes */
app.use('/api/auth', authRouter);



module.exports = app;