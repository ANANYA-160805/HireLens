require('dotenv').config();
const express = require('express');
const connectToDB = require('./config/database');

connectToDB();

const app = express();

app.use(express.json());



module.exports = app;