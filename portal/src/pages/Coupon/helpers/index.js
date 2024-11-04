const getObjectKey = (obj, value, valueDefault) => {
  let result = Object.keys(obj).find((key) => obj[key] === value);
  if (!result) {
    result = valueDefault;
  }
  return result;
};

const getObjInArrayOnly = (objArray = [], field, value, valueDefaultReturn = {}) => {
  let result = valueDefaultReturn;
  if (objArray && objArray.length) {
    for (let i = 0; i < objArray.length; i++) {
      if (objArray[i][field] == value) {
        result = objArray[i];
      }
    }
  }
  return result;
};

const checkEmptyNumber = (value, valueDefault = 0) => {
  let result = 0;
  const checkValue = parseInt(value) ?? valueDefault;
  if (checkValue) {
    result = checkValue;
  }
  return result;
};

function sumAll() {
  var result = 0;
  for (const number of arguments) {
    let checkNumber = checkEmptyNumber(number);
    result += checkNumber;
  }
  return result;
}

const checkBetweenValue = (firstValue, secondValue, valueCheck, valueOrDefault = 0) => {
  let parseValueOrDefault = checkEmptyNumber(valueOrDefault);
  if (valueCheck >= firstValue && valueCheck <= secondValue) return valueCheck;
  return parseValueOrDefault;
};

const arrayToObjDefendByKey = (obj, key, valueDefault = {}) => {
  let result = valueDefault;
  if (obj && obj?.length) {
    obj?.map((val) => {
      if (val) {
        result[val[key]] = val;
      }
    });
  }
  return result;
};

const checkArray = (value) => {
  let result = false;
  if (value && value.length) {
    result = true;
  }
  return result;
};

const convertObjArrayMapValue = (obj = [], arr = [], key = '', symBolRan = '_') => {
  let result = {};
  const checkArrayObj = checkArray(obj);
  const checkArrayArr = checkArray(arr);
  if (checkArrayObj && checkArrayArr) {
    arr?.map((val, index) => {
      if (val) {
        let constructVar = key + symBolRan + val;
        result[`${constructVar}`] = obj.reduce((p, x) => p + checkEmptyNumber(x[val]), 0);
      }
    });
  }
  return result;
};

const createObjNoValue = (arr = [], key = '', symBolRan = '_', valueDefault = null) => {
  let result = {};
  const checkArrayArr = checkArray(arr);
  if (checkArrayArr) {
    arr?.map((val, index) => {
      if (val) {
        let constructVar = key + symBolRan + val;
        result[`${constructVar}`] = valueDefault;
      }
    });
  }
  return result;
};

const isRealValue = (obj) => {
  return obj && obj !== 'null' && obj !== 'undefined';
};

const isEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
};

const getValueInArrayBykey = (obj = [], field = '') => {
  let result = 0;
  const checkArrayArr = checkArray(obj);
  if (checkArrayArr) {
    obj.map((val, index) => {
      if (val) {
        let valueFieldIndex = checkEmptyNumber(val[field]);
        result += valueFieldIndex;
      }
    });
  }
  return result;
};

const getValueReturnInArray = (valueMaxIn = 100, obj = [], field = '', indexIn) => {
  let result = 0;
  const checkArrayArr = checkArray(obj);
  if (checkArrayArr) {
    obj.map((val, index) => {
      if (val) {
        let valueFieldIndex = checkEmptyNumber(val[field]);
        if (index == indexIn) {
          valueFieldIndex = 0;
        }
        result += valueFieldIndex;
      }
    });
  }

  result = valueMaxIn - result;
  return result;
};

const convertArrayObjToArray = (obj = [], field = '', indexIn) => {
  let result = [];
  const checkArrayArr = checkArray(obj);
  if (checkArrayArr) {
    obj.map((val, index) => {
      if (val) {
        if (index == indexIn) {
          val[field] = null;
        }

        if (val[field]) {
          result.push(val[field]);
        }
      }
    });
  }
  return result;
};

const mulValueValueArray = (obj = [], valueDefault = 1) => {
  let result = valueDefault;
  const checkArrayArr = checkArray(obj);
  if (checkArrayArr) {
    obj.map((val) => {
      if (val) {
        let checkValueVal = checkEmptyNumber(val);
        if (!checkValueVal) {
          checkValueVal = 1;
        }
        result *= checkValueVal;
      }
    });
  }
  return result;
};

const checkSubValue = (totalValue, obj = []) => {
  let getTotalValueArr = mulValueValueArray(obj);
  let checkTotalValue = checkEmptyNumber(totalValue);
  let result = false;
  if (checkTotalValue < getTotalValueArr) {
    result = true;
  }
  return result;
};

const generateRandomString = (type = 1, totalLetter = 6) => {
  // type: 1: cả chữ và số; 2: chỉ chữ; 3: chỉ số /// totalLetter số ký tự
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  if (type === 1) {
    for (let i = 0; i < totalLetter; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  } else if (type === 2) {
    for (let i = 0; i < totalLetter; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      result += alphabet.charAt(randomIndex);
    }
    return result;
  } else if (type === 3) {
    for (let i = 0; i < totalLetter; i++) {
      const randomNumber = Math.floor(Math.random() * 10);
      result += randomNumber.toString();
    }
    return result;
  }
};

const utilVar = {
  getObjectKey: getObjectKey,
  checkEmptyNumber: checkEmptyNumber,
  checkBetweenValue: checkBetweenValue,
  getObjInArrayOnly: getObjInArrayOnly,
  sumAll: sumAll,
  arrayToObjDefendByKey: arrayToObjDefendByKey,
  convertObjArrayMapValue: convertObjArrayMapValue,
  isRealValue: isRealValue,
  checkArray: checkArray,
  createObjNoValue: createObjNoValue,
  isEmpty: isEmpty,
  getValueInArrayBykey: getValueInArrayBykey,
  getValueReturnInArray: getValueReturnInArray,
  convertArrayObjToArray: convertArrayObjToArray,
  checkSubValue: checkSubValue,
  mulValueValueArray: mulValueValueArray,
};

export default utilVar;

export { generateRandomString };
