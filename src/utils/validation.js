const isContains = (value, allowedValues)=>{
    if(!allowedValues.includes(value)){
        return false;
    }
    return true;
}

const isValidEmail = (email)=>{
}

const isRequestBodyValid = (req)=>{
    const {firstName, lastName, age, email, password, gender} = req;
    if(!firstName || !email || !password || !gender || !age){
        return false;
    }
    return true;
}

module.exports = {
    isContains,
    isValidEmail,
    isRequestBodyValid
}