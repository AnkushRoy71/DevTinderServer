const isContains = (value, allowedValues)=>{
    if(!allowedValues.includes(value)){
        return false;
    }
    return true;
}

module.exports = {
    isContains
}