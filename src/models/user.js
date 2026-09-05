const mongoose = require('mongoose');
const validator = require('validator');
const { isContains, isPasswordStrong } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email format");
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return isPasswordStrong(value);
        },
      },
    },
    gender: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          if (!isContains(value, ["male", "female", "other"])) {
            throw new Error("Invalid gender value");
          }
        },
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },  
    about:{
      type: String,
      maxlength: 500,
      default: "Hey there! I am using DevTinder.",
      validate(value) {
        return validator.escape(value);
      }
    }
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({ id: this._id }, 'Dev@Tinder#1234');
    return token;
};

userSchema.methods.hashedPassword = async function(){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      return hashedPassword;
}

userSchema.methods.isPasswordValid = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;