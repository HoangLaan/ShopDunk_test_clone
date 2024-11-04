const checkEmpty = (value, valueDefault = null) => {
    let result = valueDefault;
    if(value) {
        result = value;
    }
    return result;
}
const isEmptyObj = (obj = {}) => {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return true;
      }
    }
  
    return false;
}

function objAssign (){
    let result = {};
    for (let i = 0; i < arguments.length; i++) {
        const checkObj = isEmptyObj(checkEmpty(arguments[i]));
        if(checkObj) {
            result = Object.assign(result, arguments[i]);
        }
    }
    return result;
}


module.exports = {
    objAssign,
};
