const { ERROR_MESSAGES } = require('./constants');

const convertErrorCode = (error, defaultMessage = '') => {
    let message = ERROR_MESSAGES[error.message];
    const data = error.cause;
    if (message) {
        if (data) {
            Object.keys(data).forEach((key) => {
                message = message.replace(`{${key}}`, data[key]);
            });
        }

        return message;
    }

    return defaultMessage;
};

const checkMinMax = (min, max, value) => {
    if (min < max) {
        if (value < min || value > max) {
            return false;
        }
    }

    if (min > max) {
        if (value < min) {
            return false;
        }
    }

    return true;
};

const checkEmptyArray = (value) => {
    if(value && Array.isArray(value) && value.length > 0) {
        return true;
    }
    return false;
}

const returnNumber = (value) => {
    const result = parseInt(value) ?? 0;
    return result;
}

const checkObjInstant = (value, fieldArr) => {
    const checkValueArr = checkEmptyArray(fieldArr);
    if(checkValueArr) {
        fieldArr.map((val, index) => {
            if(val) {
                const checkValue =  Object.getOwnPropertyDescriptor(value, val);
                if(!checkValue) {
                    return false;
                }
            }
        })
    }
    return true;
}

const getValueInArrayInArray = (value, field, fielGet, valueDefault = 0) => {
    let result = valueDefault;
    const checkValueArr = checkEmptyArray(value);
    if(checkValueArr) {
        value?.map((val, index) => {
            if(val) {
                if(val[field]) {
                    const checkArrayValueMap = checkEmptyArray(val[field]);
                    if(checkArrayValueMap) {
                        val[field].map((valIn, index) => {
                            if(valIn) {
                                if(valIn[fielGet]) {
                                    result += returnNumber(valIn[fielGet]);
                                }
                            }
                        })
                    }
                }
            }
        })
    }
    return result;
};

const getValueAndConcatInArrayByField = (value, field, sysbob = ',', valueDefault = '') => {
    let result = valueDefault
    const checkValueArr = checkEmptyArray(value);
    if(checkValueArr) {
        value.map((val, index) => {
            const checkObj = checkObjInstant(val, [field]);
            if(checkObj) {
                if(result) {
                    result += sysbob + val[field];
                } else {
                    result += val[field];
                }

            }
        })
    }
    return result;
}

module.exports = {
    convertErrorCode,
    checkMinMax,
    getValueInArrayInArray,
    getValueAndConcatInArrayByField,
};
