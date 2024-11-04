const selectProductType = [
  { value: 1, label: 'IMEI' },
  { value: 2, label: 'Sản phẩm / túi' },
  { value: 3, label: 'Model' },
];

const cloneSelectProductType = JSON.parse(JSON.stringify(selectProductType));

const jsonStrings = cloneSelectProductType.map(item => JSON.stringify(item.value));

const checkProductType = jsonStrings.reduce((obj,value) => {
  if(value){
      obj[value] = parseInt(value);
      return obj;
  }
},{});

const checkEmptyArray = (value) => {
  if(value && Array.isArray(value) && value.length > 0) {
    return true;
  }

  return false;
}

const DEFFPRODUCTMATERIAL = {
  product: 1,
  material: 2,
}

module.exports = {
  selectProductType,
  checkProductType,
  DEFFPRODUCTMATERIAL,
  checkEmptyArray,
}
