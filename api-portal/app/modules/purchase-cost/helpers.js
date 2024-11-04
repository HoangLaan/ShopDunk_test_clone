const checkAndParseNumber = (value) => {
  let result = 0;
  if(value) {
    result = parseInt(value) ?? 0;
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

const pushValueToArray = (objArray, field, func = parseInt) => {
  let result =  [];
  let checkArr = convertObjArrayMapValue(objArray);
  if(checkArr) {
    objArray.map((val) => {
      if(val) {
        let getVal = val[field];
        if(func) {
          getVal = func(getVal) ?? 0;
        }
        result.push(getVal);
      }
    })
  }
  return result;
}

const arrayJoinToString = (value, valueDefault = '' , sysBol = ',') => {
  let result = valueDefault;
  let checkValue = checkArray(value);
  if(checkValue) {
    value.map((val, ver) => {
      if(val) {
        if(result) {
          result = result  + sysBol + val;
        } else {
          result = result + val;
        }
      }
    });
  }
  return  result;
}

const stringToArray = (value, type = 'number', valueDefault = [], sysBol = ',' ) => {
  let result = valueDefault;
  if(value) {
    value = value.toString();
    let checkInclude = value.includes(sysBol);
    let pasreInArr = [];
    if(checkInclude) {
      pasreInArr = value.split(sysBol);
    } else {
      pasreInArr = [value];
    }

    if(type == 'number') {
      const checkArrayVar = checkArray(pasreInArr);
      if(checkArrayVar) {
        pasreInArr.map((val, index) => {
          if(val) {
            const checkNumber = parseInt(val) ?? 0;
            if(checkNumber) {
              result.push(checkNumber);
            }
          }
        })
      }
    }
  }

  return result;
}

module.exports = {
  checkAndParseNumber,
  convertObjArrayMapValue,
  checkArray,
  pushValueToArray,
  arrayJoinToString,
  stringToArray,
};
