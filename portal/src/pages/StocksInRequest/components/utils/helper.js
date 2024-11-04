import { buildSku } from 'utils/index';

// tính giá vốn và thành tiền vốn của sản phẩm
export const updateProductPrice = (watch, keyProduct, setValue) => {
  let objectCost = {};
  if (!watch('cost_type_list') || watch('cost_type_list').length === 0) {
    objectCost = renderCost(watch(keyProduct));
  }
  if (watch('is_apply_unit_price')) {
    objectCost = renderCostApply(watch(keyProduct));
  } else {
    const { total_price, total_cost_apply } = getTotalCostApply(
      watch('products_list'),
      watch('cost_type_list'),
      watch('is_apply_unit_price'),
    );
    let list = [...watch('products_list')];
    // Chi filter cac dong da chon san pham co gia , va don vi
    list = (list || []).filter((p) => (p.total_price || p.cost_price) && p.quantity);
    // Neu co danh sach san pham dang ap dung chi phi thi tinh kiem tra lai
    let product_apply_cost_clone = [];
    if (!watch('product_apply_cost') || watch('product_apply_cost').length === 0) {
      product_apply_cost_clone = (list || []).reduce((l, v) => {
        const idx = l.findIndex((x) => x.product_id == v.product_id);
        if (idx < 0) l.push(v);
        return l;
      }, []);
    } else {
      // Xoa dong thong ke di
      let current_product_apply_cost = {};

      (list || []).forEach((product) => {
        const idx = (watch('product_apply_cost') || []).findIndex((v) => v.product_id == product.product_id);
        if (idx >= 0) {
          current_product_apply_cost[product.product_id] = watch('product_apply_cost')[idx];
        } else
          current_product_apply_cost[product.product_id] = {
            ...product,
          };
      });
      product_apply_cost_clone = Object.values(current_product_apply_cost);
    }
    // Tinh lai chi phi tren so luong
    let total_quantity = 0;
    (product_apply_cost_clone || []).forEach((p) => {
      // Cap nhat lai tong so luong cua nhap kho
      total_quantity += p.quantity;
    });
    // Tính tổng tiền phan bo trên từng loại sản phẩm chi phí / số lượng
    const cost_per_quantity = ((total_cost_apply || 0) / (total_quantity || 1)).toFixed(2);

    if (cost_per_quantity) {
      objectCost = renderTotalCostApply(watch(keyProduct), cost_per_quantity);
    }
    setValue('product_apply_cost', product_apply_cost_clone);
    setValue('total_quantity', total_quantity);
    setValue('cost_per_quantity', cost_per_quantity);
    setValue('total_cost_apply', total_cost_apply);
  }

  setValue(`${keyProduct}.cost_basic_imei_code`, objectCost.cost_basic_imei_code);
  setValue(`${keyProduct}.total_cost_basic_imei`, objectCost.total_cost_basic_imei);
  setValue(`${keyProduct}.total_price_cost`, objectCost.total_price_cost);
};

//tinh gia vốn và thanh tiền ((Không có chi phí))
export const renderCost = (product) => {
  const { cost_price = 0, quantity = 0, cost = 0, total_price = 0 } = product;
  const cost_basic_imei_code = (cost_price * 1 + cost).toFixed(2);
  const total_cost_basic_imei = (cost_basic_imei_code * 1 * (quantity * 1)).toFixed(3);
  const total_price_cost = total_price * 1 + cost;
  return { cost_basic_imei_code, total_cost_basic_imei, total_price_cost };
};

const checkNaN = (value, valueDefault = 0) => {
  let result = value;
  let checkNaN = isNaN(value);
  if(checkNaN) {
    result = valueDefault;
  }
  return result;
}

export const checkNumber = (value, valueDefault = 0) => {
  let result = valueDefault;
  if(value) {
    result = parseInt(value) ?? 0;
    result = checkNaN(result);
  }
  return result;
}

const checkEmptyArr = (arr) => {
  let result = false;
  if (
    typeof arr != "undefined" &&
    arr != null &&
    arr.length != null &&
    arr.length > 0
  ) {
    result = true
  }
  return result;
}

const isEmptyObj = (obj, ) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return true;
    }
  }
  return false;
}

const asignValueArrayToObj = (obj = {}, arr = [], valueDefault = {}) => {
  let cloneObj = structuredClone(obj);
  let result = cloneObj;
  let checkArr = checkEmptyArr(arr);
  let checkObj = isEmptyObj(cloneObj);
  
  if(!checkArr || !checkObj) {
    result  = valueDefault;
  } else {
    let arrKeyObj = Object.keys(cloneObj);
    arrKeyObj?.map((val, index) => {
      if(val) {
        cloneObj[val] = arr[index]
      }
    })
    
    result = cloneObj;
  }
  return result;
}

const renderPurchaseCost = (value, quanlity, objPurchaseCostDefault = {}) => {
  let checkValue = checkNumber(value);
  let checkQuanlity = checkNumber(quanlity);
  if(!checkQuanlity) {
    checkQuanlity = 1;
  }

  let valueCostQuanlity = Math.round(checkValue / checkQuanlity);
  let cloneObjPurchaseCost = structuredClone(objPurchaseCostDefault);
  let result = asignValueArrayToObj(cloneObjPurchaseCost, [ checkValue, valueCostQuanlity ], cloneObjPurchaseCost);
  return result;
}

const objPurchaseCost = {
  purchase_cost_total: 0,
  purchase_cost_imei: 0,
}

// tinh gia vốn và thanh tiền ((áp dụng theo đơn giá))
export const renderCostApply = (product) => {
  const { quantity = 0, cost_apply_list = [], total_price = 0, cost_price = 0, total_cost_price = 0 } = product;
  // tinh tong gia giam
  const cost_discount = (cost_apply_list || [])
    .filter((v) => v.is_discount)
    .reduce((total, v) => (total += (v.cost_value || 0) * 1), 0);
  const cost = (cost_apply_list || [])
    .filter((v) => !v.is_discount)
    .reduce((total, v) => (total += (v.cost_value || 0) * 1), 0);
  let checkApplyPurchaseCost = renderPurchaseCost(total_cost_price, (quantity * 1), objPurchaseCost);
  let cost_basic_imei_code = (cost_price * 1 + cost - cost_discount).toFixed(2) * 1;
  const total_cost_basic_imei = (cost_basic_imei_code * 1 * (quantity * 1) + total_cost_price ).toFixed(3) * 1;
  const total_price_cost = total_price * 1 + cost - cost_discount + checkApplyPurchaseCost?.purchase_cost_total;
  cost_basic_imei_code += checkApplyPurchaseCost?.purchase_cost_imei;
  
  return { cost_basic_imei_code, total_cost_basic_imei, total_price_cost };
};

//tính giá vốn và thành tiền vốn ((Không áp dụng theo đơn giá))
export const renderTotalCostApply = (product, cost_per_quantity) => {
  const { cost_price = 0, quantity = 0, total_price = 0 , total_cost_price = 0} = product;
  let checkApplyPurchaseCost = renderPurchaseCost(total_cost_price, (quantity * 1), objPurchaseCost);
  let cost_basic_imei_code = cost_price * 1 + cost_per_quantity * 1;
  const total_cost_basic_imei = (cost_basic_imei_code * 1 * (quantity * 1) + total_cost_price).toFixed(3);
  
  const total_price_cost = total_price * 1 + cost_per_quantity * 1 + checkApplyPurchaseCost?.purchase_cost_total;
  cost_basic_imei_code += checkApplyPurchaseCost?.purchase_cost_imei;
  return { cost_basic_imei_code, total_cost_basic_imei, total_price_cost };
};
// Tính tổng chi phí và số tiền chi phí trên tổng đơn hàng
export const getTotalCostApply = (productList = [], costTypeList = [], isApplyUnitPrice) => {
  const total_price = (productList || []).reduce((total, p) => (total += (p.total_price || 0) * 1), 0);

  let total_cost_apply = 0;
  if (isApplyUnitPrice) return { total_cost_apply, total_price };
  const cost_discount = (costTypeList || [])
    .filter((v) => v.is_discount)
    .reduce((total, v) => (total += (v.cost_value || 0) * 1), 0);
  const cost = (costTypeList || [])
    .filter((v) => !v.is_discount)
    .reduce((total, v) => (total += (v.cost_value || 0) * 1), 0);
  total_cost_apply = cost - cost_discount;
  return { total_cost_apply, total_price };
};

//  mã skus products
export const checkSku = (list, sku) => {
  return list.findIndex((x) => x.sku == sku);
};
export const getCurrentSkuList = (product) => {
  let list = [];
  const { skus = [] } = product;
  list = [...list, ...skus.filter((x) => x)];
  return list;
};
