const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/blacklist.model');



function authUser(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized, token not found'});
    }

    const isTokenBlackListed = tokenBlacklist.findOne({token});

    if(isTokenBlackListed){
        return res.status(401).json({message: 'Unauthorized,token is blacklisted'});
    }

   try{
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
   } catch(err){
       return res.status(401).json({message: 'Unauthorized, invalid token'});
   }
}

module.exports = authUser;