export const EMAIL_LIST_TYPE = {
  PRESONAL: 1,
  LEAD: 2,
  PARNER: 3,
};

export const MAIL_SUPPLIER = {
  MAIL_CHIMP: 1,
};

export const LIST_TYPE = [
  {
    label: 'Cá nhân',
    value: EMAIL_LIST_TYPE.PRESONAL,
  },
  {
    label: 'Tiềm năng',
    value: EMAIL_LIST_TYPE.LEAD,
  },
  {
    label: 'Doanh nghiệp',
    value: EMAIL_LIST_TYPE.PARNER,
  },
];

export const MAIL_SUPPLIER_OPTS = [
  {
    label: 'Mailchimp',
    value: MAIL_SUPPLIER.MAIL_CHIMP,
  },
];

export const MAIL_STATUS = [
  {
    label: 'Tất cả',
    value: null,
    class: 'primary',
  },
  {
    label: 'Đang xử lý',
    value: 0,
    class: 'warning',
  },
  {
    label: 'Đã gửi',
    value: 1,
    class: 'success',
  },
  {
    label: 'Chờ gửi',
    value: 2,
    class: 'warning',
  },
  {
    label: 'Thất bại',
    value: 3,
    class: 'danger',
  },
];

export const CRM_ACCOUNT_FIELDS = [
  {
    label: 'Sinh nhật (BIRTHDAY)',
    value: 'BIRTHDAY',
  },
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: 'FULLNAME',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: 'PHONENUMBER',
  },
  {
    label: 'Email (EMAIL)',
    value: 'EMAIL',
  },
  {
    label: 'ID (MEMBERID)',
    value: 'MEMBERID',
  },
];

export const CRM_DATALEADS_FIELDS = [
  {
    label: 'Sinh nhật (BIRTHDAY)',
    value: 'BIRTHDAY',
  },
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: 'FULLNAME',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: 'PHONENUMBER',
  },
  {
    label: 'Email (EMAIL)',
    value: 'EMAIL',
  },
  {
    label: 'ID (DATALEADSID)',
    value: 'DATALEADSID',
  },
];

export const CRM_PARTNER_FIELDS = [
  {
    label: 'Tên đối tác (PARTNERNAME)',
    value: 'PARTNERNAME',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: 'PHONENUMBER',
  },
  {
    label: 'Email (EMAIL)',
    value: 'EMAIL',
  },
  {
    label: 'ID (PARTNERID)',
    value: 'PARTNERID',
  },
];
