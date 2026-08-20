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
        token
    });
}

module.exports = {
    registerUserController
};