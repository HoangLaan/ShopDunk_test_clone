const COOKIE_JWT = 'token';

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};


const LAGUAGE_TYPES = {
  VIE: 1,
  ENG: 2,
};

const STATUS_TYPES = {
  HIDDEN: 0,
  ACTIVE: 1,
  ALL: 2,
};
const STATUS_REVIEW = {
  NOTREVIEW: 0,
  REVIEWED: 1,
  REVIEWING: 2,
  AUTOREVIEW: 3,
  ALL: 4,
};

const GENDER_TYPES = {
  ALL: 2,
  MALE: 1,
  FEMALE: 0,
};
const REVIEW_STATUS_TYPES = {
  NOREVIEW: 0,
  NOTYETREVIEW: 1,
  REVIEWING: 2,
  REVIEWED: 3,
  ALL: 4,
};

const GENDER_OPTIONS = [
  {
    value: 1,
    label: 'Nam',
  },
  {
    value: 0,
    label: 'Nữ',
  },
];

const SYSTEM_OPTIONS = {
  HIDDEN: 0,
  ACTIVE: 1,
  ALL: 2,
};


const LANGUAGE_OPTIONS = [
  {
    value: 1,
    label: 'Tiếng Việt',
  },
  {
    value: 2,
    label: 'Tiếng Anh',
  },
];

const STATUS_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Kích hoạt',
  },
  {
    value: 0,
    label: 'Khóa',
  },
];

const SOURCE_TYPES = [
  {
    key: 1,
    label: 'Facebook',
    value: 1,
  },
  {
    key: 2,
    label: 'Zalo',
    value: 2,
  },
  {
    key: 3,
    label: 'Hotline',
    value: 3,
  },
  {
    key: 4,
    label: 'Tawk.to',
    value: 4,
  },
  {
    key: 5,
    label: 'Website',
    value: 5,
  },
  {
    key: 6,
    label: 'Instagram',
    value: 6,
  },
  {
    key: 7,
    label: 'Người giới thiệu',
    value: 7,
  },
  {
    key: 0,
    label: 'Khác',
    value: 0,
  },
];

const STATUS_STOCKS_IN = {
  ALL: 2,
  STOCKED: 1,
  NOTYETSTOCKED: 0,
};

const TYPE_NOTIFY = {
  MAIL: 'MAIL',
  ANNOUNCE: 'ANNOUNCE',
};

const OPTION_TYPE_GLOBAL = {
  AREA: 'AREA',
  DEPARTMENT: 'DEPARTMENT',
  BUSINESS: 'BUSINESS',
  CLUSTER: 'CLUSTER',
};

const BUDGET_CREATION = {
  ALL: 2,
  HAVE: 1,
  NOT_HAVE: 0,
};

const RETURN_CONDITION = {
  ALL: 0,
  ISRETURN: 1,
  ISEXCHANGE: 2,
};

const DEFAULT_PAGINATION = {
  items: [],
  itemsPerPage: 0,
  page: 0,
  totalItems: 0,
  totalPages: 0,
};

const LARGE_LIST_PARAMS = {
  is_active: 1,
  page: 1,
  itemsPerPage: 25,
};

const MEDIUM_LIST_PARAMS = {
  is_active: 1,
  page: 1,
  itemsPerPage: 10,
};

const SMALL_LIST_PARAMS = {
  is_active: 1,
  page: 1,
  itemsPerPage: 5,
};

const FORM_RULES = {
  phone: {
    required: 'Số điện thoại là bắt buộc',
    pattern: {
      value: /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      message: 'Số điện thoại phải là số',
    },
  },
  email: {
    required: 'Email là bắt buộc',
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Email không hợp lệ',
    },
  },
  number: (message = 'Vui lòng chỉ nhập số') => ({
    pattern: {
      value: /^[0-9]+$/,
      message,
    },
  }),
  vietnameseName: (message = 'Tên không được chứa ký tự đặc biệt') => ({
    value:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
    message,
  }),
};

export {
  query,
  // formatter,
  COOKIE_JWT,
  STATUS_TYPES,
  LAGUAGE_TYPES,
  LANGUAGE_OPTIONS,
  STATUS_OPTIONS,
  GENDER_TYPES,
  STATUS_REVIEW,
  REVIEW_STATUS_TYPES,
  GENDER_OPTIONS,
  STATUS_STOCKS_IN,
  TYPE_NOTIFY,
  BUDGET_CREATION,
  RETURN_CONDITION,
  SOURCE_TYPES,
  SMALL_LIST_PARAMS,
  MEDIUM_LIST_PARAMS,
  LARGE_LIST_PARAMS,
  FORM_RULES,
  DEFAULT_PAGINATION,
  SYSTEM_OPTIONS,
};
