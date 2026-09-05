const validator = require('validator')

const isContains = (value, allowedValues)=>{
    if(!allowedValues.includes(value)){
        return false;
    }
    return true;
}

const isPasswordStrong = (newPassword)=>{
    if (!validator.isStrongPassword(newPassword)) {
      return new Error("Password is not strong enough");
    }
    return true
}

const isRequestBodyValid = (req)=>{
    const {firstName, lastName, age, email, password, gender} = req;
    if(!firstName || !email || !password || !gender || !age){
        return false;
    }
    return true;
}

const isUpdateUserValid = (updateData) => {
    const fieldsAllowedToEdit = ['firstName','lastName','gender','age', 'photoUrl', 'about'];
    const isValid = Object.keys(updateData).every((key)=>{
        return fieldsAllowedToEdit.includes(key)
    })
    if(isValid) return true;
    else false;
};



module.exports = {
  isContains,
  isPasswordStrong,
  isRequestBodyValid,
  isUpdateUserValid,
};