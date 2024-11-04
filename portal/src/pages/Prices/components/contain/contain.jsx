const selectProductType = [
  { value: 1, label: 'IMEI', labelCode: 'Mã sản phẩm', labelName: 'Tên sản phẩm' },
  { value: 2, label: 'Sản phẩm / Túi bao bì', labelCode: 'Mã sản phẩm', labelName: 'Tên sản phẩm' },
  { value: 3, label: 'Model', labelCode: 'Mã Model', labelName: 'Tên Model' },
];

const selectProductTypeList = [
  { value: 1, label: 'IMEI' },
  { value: 2, label: 'Sản phẩm / Túi bao bì' },
];

const defineProductTypeList = {
  imei: 'Imei',
  product: 'Sản phẩm',
}

const cloneSelectProductType = structuredClone(selectProductType);

const cloneArraySelectProductTypeObj = cloneSelectProductType.reduce((a, v) => ({ ...a, [v?.value]: v}), {});

const jsonStrings = cloneSelectProductType.map(item => JSON.stringify(item.value));

const checkProductType = jsonStrings.reduce((obj,value) => {
  if(value){
      obj[value] = parseInt(value);
      return obj;
  }
},{});

const objectParse = (item) => {
  return {
    id: item,
    value: item,
  };
};

const PANEL_TYPES = {
  MODEL: 'Model',
  MODEL_ATTRIBUTE: 'Kết hợp với thuộc tính',
};

const defendPriceDateUsing = {
  '4': {
    value: 4,
    name: 'Tất cả',
    classActive: 'bw_btn',
    classActiveBtn: 'bw_btn_outline bw_btn_outline_default',
  },
  '1': {
    value: 1,
    name: 'Hết hạn áp dụng',
    classActive: 'bw_btn_warning',
    classActiveBtn: 'bw_btn_outline bw_btn_outline_warning',
  },
  '2': {
    value: 2,
    name: 'Đang áp dụng',
    classActive: 'bw_btn_success',
    classActiveBtn: 'bw_btn_outline bw_btn_outline_success',
  },
  '3': {
    value: 3,
    name: 'Chưa áp dụng',
    classActive: 'bw_btn_danger',
    classActiveBtn: 'bw_btn_outline bw_btn_outline_danger',
  },  
}

export {
  selectProductType,
  selectProductTypeList,
  checkProductType,
  defineProductTypeList,
  PANEL_TYPES,
  objectParse,
  defendPriceDateUsing,
  cloneArraySelectProductTypeObj,
}
