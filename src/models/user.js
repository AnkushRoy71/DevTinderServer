const mongoose = require('mongoose');
const validator = require('validator');
const { isContains } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName:{
        type: String,
        minlength: 2,
        maxlength: 50
    },
    age:{
        type: Number,
        required: true,
        min: 18
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate:{
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email format");
                }
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate:{
            validator(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Password is not strong enough");
                }
            }
        }
    },
    gender:{
        type: String,
        required: true,
        validate:{
            validator(value){
                if(!isContains(value, ["male", "female", "other"])){
                    throw new Error("Invalid gender value");
                }
            }
        }
    },
},{
    timestamps: true
});

userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({ id: this._id }, 'Dev@Tinder#1234');
    return token;
};

userSchema.methods.hashedPassword = async function(password){
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;