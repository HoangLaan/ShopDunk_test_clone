const INSTALLMENT_TYPE = {
  CARD: 1,
  COMPANY: 0,
};

const DefaultFilter = {
  search: '',
  is_active: 1,
  installment_partner_id: null,
};

const DefaultValue = {
  is_active: 1,
  is_system: 0,
  installment_type: INSTALLMENT_TYPE.CARD,
  is_apply_order: 0,
  is_apply_all_category: 1,
};

export { DefaultFilter, DefaultValue, INSTALLMENT_TYPE };
