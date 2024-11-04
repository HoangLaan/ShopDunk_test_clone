const PURCHASE_ORDER_PERMISSIONS = {
  ADD: 'SL_PURCHASEORDER_ADD',
  VIEW: 'SL_PURCHASEORDER_VIEW',
  EDIT: 'SL_PURCHASEORDER_EDIT',
  DEL: 'SL_PURCHASEORDER_DEL',
  VIEW_INVOICE: 'SL_INVOICE_VIEW',
  EDIT_INVOICE: 'SL_ORDER_INVOICE_EDIT',
  CANCEL_INVOICE: 'SL_ORDER_INVOICE_CANCEL',
};

export const INVOCIE_STATUS = {
  NOT_HAVE: 0,
  ENOUGH: 1,
  NOT_ENOUGH: 2,
};

const InvoiceStatusOptions = [
  {
    label: 'Chưa có hóa đơn',
    value: INVOCIE_STATUS.NOT_HAVE,
  },
  {
    label: 'Chưa đủ hóa đơn',
    value: INVOCIE_STATUS.NOT_ENOUGH,
  },
  {
    label: 'Đã đủ hóa đơn',
    value: INVOCIE_STATUS.ENOUGH,
  },
];

export const CALCULATE_METHODS = {
  HANDLE_INPUT: 0,
  FIRST_IN_FIRST_OUT: 1,
  PREIODICAVCO: 2,
  CONTINUOSAVCO: 3,
  SPECIFIC_IDENTIFICATION_METHODL: 4,
  FROM_SELLING_PRICE: 5,
};

const cogsOptions = [
  { value: CALCULATE_METHODS.HANDLE_INPUT, label: 'Nhập đơn giá bằng tay' },
  { value: CALCULATE_METHODS.FROM_SELLING_PRICE, label: 'Nhập giá theo đơn hàng' },
  { value: CALCULATE_METHODS.PREIODICAVCO, label: 'Lấy từ đơn giá BQCK' },
  { value: CALCULATE_METHODS.CONTINUOSAVCO, label: 'Lấy từ đơn giá BQ theo từng lần nhập' },
];

const defaultValues = {
  cogs_option: CALCULATE_METHODS.CONTINUOSAVCO,
};

export { PURCHASE_ORDER_PERMISSIONS, InvoiceStatusOptions, cogsOptions, defaultValues };
