const checkArray = (value) => {
  let result = false;
  if(value && value.length) {
    result = true;
  }
  return result;
}

const arrayToString = (value, valueDefault = '' , sysBol = ',') => {
  let result = valueDefault;
  let checkValue = checkArray(value);
  if(checkValue) {
    result = value.reduce((val, ver) => val.toString() + sysBol + ver.toString());
  }
  return  result;
}

const arrayJoinToString = (value = [], valueDefault = '' , sysBol = ',') => {
  let result = valueDefault;
  let checkValue = checkArray(value);
  if(checkValue) {
    value.map((val, ver) => {
      if(val) {
        if(result) {
          result = result  + sysBol + val;
        } else {
          result = result + val;;
        }
      }
    });
  }
  return  result;
}


module.exports = {
  checkArray,
  arrayToString,
  arrayJoinToString,
};
