import utilVar from '../../helpers/index';
import { optionAccounting, defendFieldMathProduct, defendFieldMathAccount } from '../../utils/constants';
import { DEFMATHTOTALPRODUCT, DEFMATHTOTALACCOUNT } from '../../utils/constants';
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

const handleChangePriceOrVat = (methods, index ,valueCost, valueVat) => {
  let checkValueCost = utilVar.checkEmptyNumber(checkAndGetValue(methods, valueCost, index, 'cost_money', 'accounting_list'));
  let checkValueVat = utilVar.checkEmptyNumber(checkAndGetValue(methods, valueVat, index, 'vat_money', 'accounting_list'));
  const resultTotalVat = Math.round((checkValueVat * checkValueCost) / 100);
  const resultTotal = checkValueCost + resultTotalVat;
  setValueWatchByIndex(methods, index, 'return_vat_money', resultTotalVat, 'accounting_list');
  setValueWatchByIndex(methods, index, 'money', resultTotal, 'accounting_list');
  handleChangePurchaseAccount(methods, null, index, checkValueCost);
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

const handleCheckCarriage = (methods, value, objProduct) => {
  let result = 0;
  let totalResult = 0;
  if(objProduct) {
    setValueWatchByIndex(methods, null, 'products_list', objProduct);
  }
  const cloneProductList = structuredClone(checkAndGetValue(methods, objProduct, null, 'products_list'));
  let clonePurchaseCostAccount  =  utilVar.checkEmptyNumber(checkAndGetValue(methods, value, null, 'purchase_cost_account_id'));
  const fieldTotalResult = 'total_price';
  const fieldResult = 'defendField';
  const fieldCheck = 'value';

  let getObjField = utilVar.getObjInArrayOnly(optionAccounting, fieldCheck, clonePurchaseCostAccount);
  let fieldReturn = getObjField[fieldResult];
  totalResult = sumValueNumberArrayField(cloneProductList, fieldTotalResult);
  result = sumValueNumberArrayField(cloneProductList, getObjField[fieldResult]);
  const resultReturn = {
    totalResult: totalResult,
    result: result,
    fieldReturn: fieldReturn,
  };
  return resultReturn;
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

const handleCheckPriceAccount = (methods, index, field, value) => {
  let result = 0;
  let cloneAccountList = structuredClone(getValueWatchByIndex(methods, null, 'accounting_list'));
  if(index || index == 0){
    cloneAccountList = replaceValueInArrayJs(cloneAccountList, index, value, field);
    const cloneDefendFieldMathAccount = structuredClone(defendFieldMathAccount);
    let objResult = utilVar.convertObjArrayMapValue(cloneAccountList, cloneDefendFieldMathAccount, DEFMATHTOTALACCOUNT);
    checkAndAssignObj(methods, objResult);
  }
  result = sumValueNumberArrayField(cloneAccountList, field);
  return result;
}

const handleChangePurchaseAccount = (methods, value, index = null, valueIn = null, objProduct = null, checkArrId) => {
  if(value) {
    methods.setValue('purchase_cost_account_id', value);
  }
  let valuePurchaseCost = utilVar.checkEmptyNumber(checkAndGetValue(methods, value, null, 'purchase_cost_account_id', null));
  const fieldDefend = 'cost_money';
  const fieldSum = 'total_price';
  const fieldSetOne = 'total_cost_price';
  const fieldSetSecond = 'total_cost_st_request_price';
  const resultCarriage = handleCheckCarriage(methods, valuePurchaseCost, objProduct);
  const resultPriceAccount = handleCheckPriceAccount(methods, index, fieldDefend, valueIn);
  handleChangeAccountProduct(methods, resultCarriage?.result, resultPriceAccount, resultCarriage?.fieldReturn, fieldSetOne, fieldSetSecond, fieldSum);
}

const mathSumReturn = (value, sumValue, valueDividend) => {
  let checkValue = utilVar.checkEmptyNumber(value);
  let checkValueSum = utilVar.checkEmptyNumber(sumValue) ?? 1;
  let checkValueDividend = utilVar.checkEmptyNumber(valueDividend);
  let result = 0;
  result = Math.round((checkValueSum * checkValue) / checkValueDividend);
  return result;
}

const mathSumEndReturn = (totalValueNotIndex, sumValue, valueDefault = 0) => {
  let result = valueDefault;
  let checkTotalValueNotIndex = utilVar.checkEmptyNumber(totalValueNotIndex);
  let checkValueSum = utilVar.checkEmptyNumber(sumValue) ?? 1;
  result = Math.round(checkValueSum - checkTotalValueNotIndex);
  if(result < 0) {
    result = valueDefault;
  }
  return result;
}

const handleChangeAccountProduct = (methods, totalValue, totalMoneyAccount, fieldReturn, fieldSetFirst, fieldSetSecond, fieldSum, valueDefault = 0) => {
  const cloneProductList = structuredClone(getValueWatchByIndex(methods, null, 'products_list')) ?? [];
  if(cloneProductList && cloneProductList.length) {
    let totalMapByIndex = 0;
    cloneProductList?.map((val, index) => {
      if(val) {
        let valueReturn = 0;
        if(index + 1 === cloneProductList?.length) {
          valueReturn = mathSumEndReturn(totalMapByIndex, totalMoneyAccount, 0);
        } else {
          valueReturn = mathSumReturn(val[fieldReturn], totalMoneyAccount, totalValue);
        }
        totalMapByIndex += valueReturn;
        cloneProductList[index][fieldSetFirst] = valueReturn;
        let totalValueReturnProduct = utilVar.sumAll(valueReturn, val[fieldSum])
        cloneProductList[index][fieldSetSecond] = totalValueReturnProduct;
      }
    })
  }

  const cloneDefendFieldMathProduct = structuredClone(defendFieldMathProduct);
  let objResult = utilVar.convertObjArrayMapValue(cloneProductList, cloneDefendFieldMathProduct, DEFMATHTOTALPRODUCT);
  if(utilVar.isEmpty(objResult)) {
    objResult = utilVar.createObjNoValue(cloneDefendFieldMathProduct, DEFMATHTOTALPRODUCT);
  }
  checkAndAssignObj(methods, objResult);

  methods.setValue('products_list', cloneProductList);
}

const checkAndAssignObj = (methods, valObj) => {
  let checkObj = utilVar.isRealValue(valObj);
  if(checkObj) {
    Object.keys(valObj)?.map((val, index) => {
      if(val) {
        setValueWatchByIndex(methods, null, `${val}`, valObj[`${val}`])
      }
    })
  }
}

const checkValMapFunction = (val = '', func = () => {}) => {
  if(val && func) {
    func(val);
  }
}

export {
  setValueWatchByIndex,
  handleChangeAccountProduct,
  handleChangePriceOrVat,
  handleChangePurchaseAccount,
}
