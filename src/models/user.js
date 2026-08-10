const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    age:{
        type: Number
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;