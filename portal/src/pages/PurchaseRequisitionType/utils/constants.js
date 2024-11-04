export const PURCHASE_REQUISITION_TYPE_PERMISSION = {
  VIEW: 'PURCHASE_REQUISITION_TYPE_VIEW',
  ADD: 'PURCHASE_REQUISITION_TYPE_ADD',
  EDIT: 'PURCHASE_REQUISITION_TYPE_EDIT',
  DEL: 'PURCHASE_REQUISITION_TYPE_DEL',
  ADD_ACCOUNTING: 'PURCHASE_REQUISITION_TYPE_ADD_ACCOUNTING',
  DEL_ACCOUNTING: 'PURCHASE_REQUISITION_TYPE_DEL_ACCOUNTING',
};

export const ACCOUNTING_TYPE = [
  { value: 1, label: 'Phiếu nhập kho' },
  { value: 2, label: 'Phiếu xuất kho' },
  { value: 3, label: 'Phiếu yêu cầu nhập hàng (PR)' },
  { value: 4, label: 'Đơn đặt hàng (PO)' },
  { value: 5, label: 'Hóa đơn mua hàng (DO)' },
];

export const ACCOUNTING_OPTIONS = [
  { value: 1, label: 'TK Nợ' },
  { value: 2, label: 'TK Có' },
  { value: 3, label: 'TK Thuế' },
  { value: 4, label: 'TK Thuế - Bên Nợ' },
  { value: 5, label: 'TK Thuế - Bên Có' },
];

export const defaultValues = {
  accounting_list: [],
};
