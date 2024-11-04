export const validateSharedInventory = (data) => {
  if (!data || !data.length) return null;
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
  return null;
};

export const validateStockInventory = (data) => {
  if (!data || !data.length) return null;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (
      !item.store ||
      !item.stock ||
      !item.min_inventory_value ||
      !item.max_inventory_value ||
      !item.stock_duration ||
      !item.unit
    )
      return `Hạn mức tồn theo kho dòng số [${i + 1}] là bắt buộc.`;
    if (item.min_inventory_value >= item.max_inventory_value)
      return `Tồn dưới và tồn trên dòng số [${i + 1}] không hợp lệ.`;
  }
  return null;
};

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const initialValues = {
  product_code: null,
  product_name: null,
  product_category_id: null,
  unit_id: null,
  manufacture_id: null,
  origin_id: null,
  description: null,
  is_active: 1,
  is_show_web: 2,
  product_display_name: null,
  shared_inventory: [],
  stock_inventory: [],
};

export const optionsAttribute = [
  {
    label: 'Thuộc tính màu sắc',
    value: 1,
    key: 'is_color',
  },
  {
    label: 'Thuộc tính kích thước',
    value: 2,
    key: 'is_form_size',
  },
  {
    label: 'Thuộc tính túi bao bì',
    value: 3,
    key: 'is_material',
  },
  {
    label: 'Thuộc tính khác',
    value: 4,
    key: 'is_other',
  },
  // {
  //   label: 'Thuộc tính dung lượng',
  //   value: 5,
  //   key: 'is_capacity',
  //   typeInput: 'number',
  // },
  {
    label: 'Thuộc tính trọng lượng',
    value: 6,
    key: 'is_weight',
    typeInput: 'number',
  },
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0);
