const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js')

const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid User");
        }
        const decodedToken = await jwt.verify(token,'Dev@Tinder#1234');
        const user = await userModel.findById(decodedToken);
        if(!user){
            throw new Error("Invalid User");
        }
    
        next();
    }
    catch(err){
        res.status(401).send(err);
    }
}

module.exports = {
    userAuth
}