const { changeToSlug } = require("../../common/helpers/string.helper");

function validateRequired(value, errorHandler){
    !value && errorHandler(value);
}

function validateSpecialChar(value, errorHandler){
    if(value){
        const speicalCharRegex = /^[a-zA-Z0-9\s]*$/;
        !speicalCharRegex.test(value) && errorHandler(value)
    }
}

function validateMaxLength(value, maxLength = 10, errorHandler){
    value && String(value).length > maxLength && errorHandler(value);
}

function validateBooleanValue(value, successHandler, errorHandler){
    const truethyValues = ['co', '1'];
    const falsyValues = ['khong', '0'];

    if(truethyValues.includes(changeToSlug(value))){
        successHandler(1);
    }else if(falsyValues.includes(changeToSlug(value))){
        successHandler(0);
    }else{
        errorHandler();
    }
}

module.exports = {validateRequired, validateSpecialChar, validateMaxLength, validateBooleanValue };