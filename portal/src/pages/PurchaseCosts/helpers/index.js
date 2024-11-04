const getObjectKey = (obj, value, valueDefault) => {
  let result =  Object.keys(obj).find(key => obj[key] === value);
  if(!result) {
    result = valueDefault;
  }
  return result;
}

const getObjInArrayOnly = (objArray = [], field, value,valueDefaultReturn = {}) => {
  let result = valueDefaultReturn;
  if(objArray && objArray.length) {
    for(let i = 0; i < objArray.length; i++) {
      if(objArray[i][field] == value) {
        result = objArray[i];
      }
    }
  }
  return result;
}

const checkEmptyNumber = (value) => {
  let result = 0;
  const checkValue = parseInt(value) ?? 0;
  if(checkValue) {
    result = checkValue;
  }
  return result;
}

function sumAll(){
  var result =0;
  for(const number of arguments){
    let checkNumber = checkEmptyNumber(number);
    result += checkNumber;
  }
   return result;
}

const checkBetweenValue = (firstValue, secondValue, valueCheck, valueOrDefault = 0) =>  {
  let parseValueOrDefault = checkEmptyNumber(valueOrDefault);
  if(valueCheck >= firstValue &&  valueCheck <= secondValue) return valueCheck;
  return parseValueOrDefault;
}

const arrayToObjDefendByKey = (obj, key, valueDefault = {}) => {
  let result = valueDefault;
  if(obj && obj?.length) {
    obj?.map((val) => {
      if(val) {
        result[val[key]] = val;
      }
     })
  }
  return result;
}

const checkArray = (value) => {
  let result = false;
  if(value && value.length) {
    result = true;
  }
  return result;
}

const convertObjArrayMapValue = (obj = [], arr = [], key = '', symBolRan = '_') => {
  let result = {};
  const checkArrayObj = checkArray(obj);
  const checkArrayArr = checkArray(arr);
  if(checkArrayObj && checkArrayArr) {
    arr?.map((val, index) => {
      if(val) {
        let constructVar = key + symBolRan + val;
        result[`${constructVar}`] = obj.reduce((p, x) => p + checkEmptyNumber(x[val]), 0);
      }
    })
  }
  return result;
}

const createObjNoValue = (arr = [], key = '', symBolRan = '_', valueDefault = null) => {
  let result = {};
  const checkArrayArr = checkArray(arr);
  if(checkArrayArr) {
    arr?.map((val, index) => {
      if(val) {
        let constructVar = key + symBolRan + val;
        result[`${constructVar}`] = valueDefault;
      }
    })
  }
  return result;
}

const isRealValue = (obj) => {
 return obj && obj !== 'null' && obj !== 'undefined';
}

const isEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

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
}

export default utilVar;
