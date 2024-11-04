import _ from 'lodash';

export const getTabError = (errors, tab) => {
  if (!Object.keys(errors).length) return tab;
  if (
    errors['component_code'] ||
    errors['component_name'] ||
    errors['model_id'] ||
    errors['component_group_id'] ||
    errors['component_display_name'] ||
    errors['origin_id'] ||
    errors['manufacture_id'] ||
    errors['images'] ||
    errors['description'] ||
    errors['attributes']
  ) {
    return 'info';
  }
  return 'stock';
};

export const validateSharedInventory = (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (
      !item.stock_type ||
      !item.min_inventory_value ||
      !item.max_inventory_value ||
      !item.stock_duration ||
      !item.unit
    )
      return `Thông tin hạn mức tồn kho dùng chung dòng số [${i + 1}] là bắt buộc.`;
    if (item.min_inventory_value >= item.max_inventory_value)
      return `Tồn dưới và tồn trên dòng số [${i + 1}] không hợp lệ.`;
  }
};

export const validateStockInventory = (data, sharedInventory) => {
  // Kiem tra cua hang
  const findStore = data.findIndex((x) => !x.store);
  if (findStore != -1) return `Vui lòng chọn cửa hàng dòng thứ ${findStore + 1}`;
  // Kiem tra kho
  const findStock = data.findIndex((x) => !x.stock);
  if (findStock != -1) return `Vui lòng chọn kho dòng thứ ${findStock + 1}`;
  // Kiem tra dinh muc ton duoi
  const findMinInventory = data.findIndex((x) => !x.min_inventory_value);
  if (findMinInventory != -1) return `Vui lòng nhập định mức tồn dưới dòng thứ ${findMinInventory + 1}`;
  // Kiem tra dinh muc ton tren
  const findMaxInventory = data.findIndex((x) => !x.max_inventory_value);
  if (findMaxInventory != -1) return `Vui lòng nhập định mức tồn trên dòng thứ ${findMaxInventory + 1}`;
  // Kiem tra dinh muc ton duoi < ton tren
  const findInvalidInventory = data.findIndex((x) => x.min_inventory_value > x.max_inventory_value);
  if (findInvalidInventory != -1)
    return `Đinh mức tồn dưới không được lớn hơn định mực tồn trên dòng thứ ${findInvalidInventory + 1}`;
  // Kiem tra thoi gian luu kho
  const findStockDuration = data.findIndex((x) => !x.stock_duration);
  if (findStockDuration != -1) return `Vui lòng thời gian lưu kho dòng thứ ${findStockDuration + 1}`;
  // Kiem tra don vi tinh
  const findUnit = data.findIndex((x) => !x.unit);
  if (findUnit != -1) return `Vui lòng chọn đơn vị tính dòng thứ ${findUnit + 1}`;
  // Kiem tra kho trung
  const sharedInventoryTypeIds = sharedInventory.map((x) => +x.stock_type.value);
  for (let i = 0; i < data.length; i++) {
    const dataItem = data[i];
    const stockInventoryType = dataItem.options_stock.find((x) => x.id == dataItem.stock)?.type_id;
    if (sharedInventoryTypeIds.indexOf(stockInventoryType) != -1)
      return `Kho dòng thứ ${i + 1} không được trùng với kho dùng chung`;
  }
  return null;
};

export const initialValues = {
  component_code: null,
  component_name: null,
  component_group_id: null,
  unit_id: null,
  manufacture_id: null,
  origin_id: null,
  description: null,
  is_active: 1,
  component_display_name: null,
  shared_inventory: [],
  stock_inventory: [],
  model_id: [],
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0);

export const getControlActive = (fields = null, watch) => {
  if (!fields) return false;

  let isActive = true;
  for (let i in fields) {
    const value = watch(fields[i]);
    if (!Boolean(value) || (typeof value === 'object' && _.isEmpty(value))) {
      isActive = false;
      break;
    }
  }
  return isActive;
};
