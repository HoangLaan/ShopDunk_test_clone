export const PERMISSION_ACCOUNTING_ACCOUNT = {
  ADD: 'AC_ACCOUNTINGACCOUNT_ADD',
  EDIT: 'AC_ACCOUNTINGACCOUNT_EDIT',
  VIEW: 'AC_ACCOUNTINGACCOUNT_VIEW',
  DEL: 'AC_ACCOUNTINGACCOUNT_DEL',
  COPY: 'AC_ACCOUNTINGACCOUNT_COPY',
  IMPORT: 'AC_ACCOUNTINGACCOUNT_IMPORT',
  EXPORT: 'AC_ACCOUNTINGACCOUNT_EXPORT',
};

export const propertys = [
  {
    value: 0,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Dư nợ',
  },
  {
    value: 2,
    label: 'Dư có',
  },
  {
    value: 3,
    label: 'Lưỡng tính',
  },
];

export const INIT_FORM_SEARCH = {
  property: 0,
  is_active: 1,
  page: 1,
  itemsPerPage: 10,
  parent_id: 0,
};
