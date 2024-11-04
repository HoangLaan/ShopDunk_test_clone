const checkEmptyArray = (value) => {
    if(value && Array.isArray(value) && value.length > 0) {
        return true; 
    }
    return false;
}

const handleCheckValueArrayAndToString = (arr, obj = ',', valueDefault = '', fieldGet = '', valueAssign = '') => {
    let result = valueDefault;
    const checkArray = checkEmptyArray(arr);
    if(checkArray) {
        arr.map((val, index) => {
        if(val) {
            if(val[fieldGet]) {
                if(result) {
                result = result +  obj + val[fieldGet];
                } else {
                result = result + val[fieldGet];
                }
            }
        }
        })
    }

    return result;
}

const checkJsonByArrayKey = (json = {}, arr = []) => {
    for(let i = 0; i < arr.length; i++) {
      const convertToString = (arr[i]).toString();
      const checkKey = json.hasOwnProperty(convertToString);
      if(!checkKey) {
        return false;
      }
    }
    return true;
  }

const checkArray = (value) => {
    if(value && Array.isArray(value) && value.length > 0) {
        return true;
    }
    return false;
}

const getArrValueByIf = (value, feild, valueFeild, valueDefault = null) => {
    let result = valueDefault;
    const checkArrayValue = checkArray(value);
    if(checkArrayValue) {
        value?.map((value, index) => {
            if(value) {
                if(value[feild] == valueFeild) {
                    result = value;
                }
            }
        })
    }
    return result;
}

const returnNumber = (value) => {
    const result = parseInt(value) ?? 0;
    return result;
}

const getValueInArrayInArray = (value, field, fielGet, valueDefault = 0) => {
    let result = valueDefault
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
} 

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
    handleCheckValueArrayAndToString,
    checkJsonByArrayKey,
    checkArray,
    getArrValueByIf,
    getValueInArrayInArray,
    getValueAndConcatInArrayByField,
};
