const parseStringToArray = (value = '', symbolParse, objAssign) => {
  let arrayResult = [];
  if(value) {
    value = value.toString();
    value = value.split(symbolParse)
    let arrayKeyAssign = [];
    if(objAssign) {
      arrayKeyAssign = Object.keys(objAssign);
    }

    if(value && value.length > 0) {
      value.map((val, index) => {
        if(objAssign) {
          let obj = {}
          arrayKeyAssign.map((valObj, index) => {
            obj[valObj] = parseInt(val);
          });
          arrayResult.push(obj)
        } else {
          arrayResult.push(val);
        }
      })
    }
  }
  return arrayResult;
}

const parseArrayToString = (value = [], key, symbolString) => {
  let stringResult = '';
  if(value && Array.isArray(value)) {
    value.map((val, index) => {
      let mapDataKey =val[key];
      if(index) {
        stringResult = stringResult + symbolString + mapDataKey;
      } else {
        stringResult += mapDataKey;
      }
    })
  } else {
    stringResult = `${parseInt(value)}`;
  }
  return stringResult;
}

export {
  parseStringToArray,
  parseArrayToString,
}
