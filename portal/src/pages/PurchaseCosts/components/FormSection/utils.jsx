const checkArray = (value) => {
    let result = false;
    if(value && value.length) {
      result = true;
    }
    return result;
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
  
  const Utils = {
    arrayJoinToString: arrayJoinToString
  }
  
  export default Utils;