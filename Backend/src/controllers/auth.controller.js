const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/** 
 * @route POST /api/auth/register
 * @name registerUserController
 * @desc Register a new user,expects a request body with user details (e.g., username, email, password) and creates a new user in the database.
 * @access Public
 */

async function registerUserController(req, res) {
    
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const isUserExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if(isUserExists) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const hash = await bcrypt.hash(password,10);

    const user = new userModel({
        username,
        email,
        password: hash
    });

    await user.save();

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET,{expiresIn: '1d'})


    res.cookie('token', token)

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
      
    });
}


/**
 *  @route POST /api/auth/login
 * @name loginUserController
 * @description login a user, expects email and password in the request body, verifies the credentials, and returns a JWT token if successful.
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    // FIX: bcrypt, not bycrpt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
module.exports = {
    registerUserController,
    loginUserController
};