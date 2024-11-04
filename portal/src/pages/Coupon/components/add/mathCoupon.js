import utilVar from '../../helpers/index';

// get value react hook form
const getValueWatchByIndex = (methods, index, field, fieldFirst) => {
    let result = '';
    if(fieldFirst) {
      result = methods.watch(`${fieldFirst}.${index}.${field}`);
    } else if (index || index == 0) {
      result = methods.watch(`${index}.${field}`);
    } else {
      result = methods.watch(field);
    }
    return result;
  }  

// set value react hook form
const setValueWatchByIndex = (methods ,index, field, value, fieldFirst) => {
    if(fieldFirst) {
        methods.setValue(`${fieldFirst}.${index}.${field}`, value);
    } else if (index || index == 0) {
        methods.setValue(`${index}.${field}`, value);
    } else {
        methods.setValue(field, value);
    }
}

//check and get value null
const checkAndGetValue = (methods, value, index, field,  fieldFirst) =>{
    let result = value;
    if(fieldFirst && !result) {
        result = getValueWatchByIndex(methods, index, field, fieldFirst);
    } else if (!result) {
        result = getValueWatchByIndex(methods, index, field);
    }
    return result;
}

const handleRemoveItemOrSetValue = (methods, index, listValue, field) => {
    let cloneListValue = structuredClone(listValue);
    if (index > -1) { // only splice array when item is found
        cloneListValue.splice(index, 1); // 2nd parameter means remove one item only
    }
    if(field) {
        methods.setValue(field, cloneListValue);
    }
}

const sumValueNumberArrayField = (objArray = [], field) => {
  let result = 0;
  if(objArray) {
    objArray.map((val, index) => {
      if(val && val[field]) {
        let checkVal = utilVar.checkEmptyNumber(val[field]);
        result += checkVal;
      }
    })
  }
  return result;
}

const replaceValueInArrayJs = (obj = [], index, value, field, valueReturnDefault = []) => {
    let result = valueReturnDefault;
    if(obj) {
      if(index || index == 0) {
        obj[index][field] = value;
      } else {
        obj[field] = value;
      }
      result = obj;
    }
    return result;
  }
  

let objFuncPromotional = {
    '1': {
        value_sum: 100,
        value: 10,
        quantity: 10,
        math_checksum_return() {
            let result = this.value;
            if(this.value_sum <= this.value) {
                result = this.value_sum; 
            }
            return result;
        },
        math_value_return(value) {
            let result = value;
            if (!value && value !== 0) {
                result = Math.round(this.value_sum / this.quantity);
            }
            this.value = result;
            return result;
        },
        math_quality_return(value) {
            let result = this.math_checksum_return(value);
            if (!value && value !== 0) {
                result =  Math.round(this.value_sum / this.value)
            }
            this.quantity = result;
            return result;
        },
    },
    '2': {
        value_sum: 100,
        value_max_percent: 100,
        value: 10,
        quantity: 10,
        math_value_return(value) {
            let result = utilVar.checkBetweenValue(0, 100, value, 100);
            if (!value && value !== 0) {
                result = this.value;
            }
            this.value = result;
            return result;
        },
        math_quality_return(value) {
            let result = value;
            if (!value && value !== 0) {
                result = this.quantity;
            }
            this.quantity = result;
            return result;
        },
    }
}

const checkBudget = (methods, value) => {
    setValueWatchByIndex(methods, null, 'budget', value);
    checkAndGetValuePromational(methods, value, null);
}

const checkAndGetValuePromational = (methods, value, index, field, valueField) => {
    let promationalList = structuredClone(checkAndGetValue(methods, null, null, 'promotional_list')) ?? [];
    if(field) {
        promationalList = replaceValueInArrayJs(promationalList, index, valueField, field);
    }
    
    const valueBudget = structuredClone(checkAndGetValue(methods, value, null, 'budget')) ?? 0;
    let checkArrayPro = utilVar.checkArray(promationalList);
    if(!checkArrayPro) {
        promationalList = []
    } else {
        promationalList.map((val, indexT) => {
            if(val) {
                let percentValue = utilVar.checkEmptyNumber(val?.percent_value) || 100;
                let quantityValue = val?.quantity ? utilVar.checkEmptyNumber(val?.quantity, 1) : 1;
                let codeValue = val?.code_value ? utilVar.checkEmptyNumber(val?.code_value, 1) : 1;
                let getValue = valueBudget * percentValue;
                let getAndRoundValue = Math.round((getValue / 100));
                promationalList[indexT].total_value = getAndRoundValue;
                let valueCostType = utilVar.checkEmptyNumber(val.code_type) || 1;
                objFuncPromotional[`${valueCostType}`].value_sum = getAndRoundValue;
                let getValueCode = 1;
                let getValueQuality = 1;

                if(valueCostType * 1 === 2) {
                    if(quantityValue > 100) {
                        quantityValue = 100;
                    } 
                    if(codeValue > 100) {
                        codeValue = 100;
                    }
                    promationalList[indexT].min_total_money = null;
                    promationalList[indexT].max_total_money = null;
                } else {                    
                    if(codeValue > getAndRoundValue) {
                        quantityValue = getAndRoundValue;
                    }
                }

                if(valueCostType * 1 === 2) {
                    objFuncPromotional[`${valueCostType}`].value = codeValue;
                }

                if(field === 'quanlity' && index == indexT) {
                    if(valueCostType * 1 === 2) {
                        valueField = valueField > 100 ? 100 : valueField;
                    }
                    objFuncPromotional[`${valueCostType}`].value = codeValue;
                    getValueQuality = objFuncPromotional[`${valueCostType}`].math_quality_return(valueField);
                    objFuncPromotional[`${valueCostType}`].quantity = getValueQuality;
                    getValueCode = objFuncPromotional[`${valueCostType}`].math_value_return();
                } else if(field === 'code_value' && index == indexT) {
                    if(valueCostType * 1 === 2) {
                        valueField = valueField > 100 ? 100 : valueField;
                    } else {
                        valueField = valueField > getAndRoundValue ? getAndRoundValue : valueField;
                    }
                    objFuncPromotional[`${valueCostType}`].quantity = quantityValue;
                    getValueCode = objFuncPromotional[`${valueCostType}`].math_value_return(valueField);
                    console.log('objFuncPromotional',objFuncPromotional)
                    objFuncPromotional[`${valueCostType}`].value = getValueCode;
                    getValueQuality = objFuncPromotional[`${valueCostType}`].math_quality_return();
                } else {
                    objFuncPromotional[`${valueCostType}`].quantity = quantityValue;
                    getValueCode = objFuncPromotional[`${valueCostType}`].math_value_return();
                    objFuncPromotional[`${valueCostType}`].value = getValueCode;
                    getValueQuality = objFuncPromotional[`${valueCostType}`].math_quality_return();
                }
                
                promationalList[indexT].code_value = isNaN(getValueCode) ? 0 : getValueCode;
                promationalList[indexT].quantity = isNaN(getValueQuality) ? 0 : getValueQuality;
            }
        })
    }

    let resultTotalValue = 0;
    if(promationalList) {
        resultTotalValue = utilVar.getValueInArrayBykey(promationalList, 'total_value');
    } 
    setValueWatchByIndex(methods, null, 'total_coupon_value', resultTotalValue);
    setValueWatchByIndex(methods, null, 'promotional_list', promationalList);
}

const checkSubValueBool = (valTotal, valOne, valSecond) => {
    let check = utilVar.checkSubValue(valTotal, [valOne, valSecond]);
    let result = valOne;
    if(check && valTotal > 0) {
        result -= 1;
        checkSubValueBool(valTotal, result, valSecond)
    }
    return result;
} 

const checkCodePromotionalList = (value, index, ObjArray, SysBolAdd = 'C') => {
    let result = structuredClone(value);
    let arrCheck = utilVar.convertArrayObjToArray(ObjArray, 'coupon_code' , index);
    if(arrCheck) {
        let checkValue = arrCheck.includes(`${value}`);
        if(checkValue) {
            result = result + SysBolAdd;
            result = checkCodePromotionalList(result, index, ObjArray, SysBolAdd);
        }
    }
    return result;
}

const handleGetTotal = (objArr, valueDefault = 0) => {
    let result = valueDefault;
    let getTotalValueArr = utilVar.mulValueValueArray(objArr);
    let checkArr = utilVar.checkArray(objArr);
    if(checkArr) {
        result = Math.round((getTotalValueArr / 100));
    }
    return result;
}

export {
    getValueWatchByIndex,
    setValueWatchByIndex,
    checkAndGetValue,
    handleRemoveItemOrSetValue,
    sumValueNumberArrayField,
    checkBudget,
    checkAndGetValuePromational,
    checkCodePromotionalList,
    handleGetTotal,
}
