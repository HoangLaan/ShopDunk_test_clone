import { toast } from 'react-toastify';

import {
  STATUS_REVIEW,
  GENDER_TYPES,
  STATUS_TYPES,
  REVIEW_STATUS_TYPES,
  STATUS_STOCKS_IN,
  TYPE_NOTIFY,
  BUDGET_CREATION,
  RETURN_CONDITION,
  SYSTEM_OPTIONS,
} from './constants';

/**
 * Map data options
 * @param {Array} data
 * @return {Array}
 */
export const mapDataOptions4Select = (data, valueName = 'value', labelName = 'label') => {
  return (Array.isArray(data) ? data : []).map((_item) => {
    let item = { ..._item };
    let { id, name, label, value } = item;
    label = name || item[labelName];
    value = id || item[valueName];
    return { ..._item, label, value };
  });
};
export function mapDataOptions4SelectCustom(data, valueName = 'value', labelName = 'label') {
  return (Array.isArray(data) ? data : []).map((_item) => {
    let item = { ..._item };
    let { id, name, label, value } = item;
    label = name || item[labelName];
    value = 1 * id || 1 * item[valueName];
    return { ..._item, label, value };
  });
}
export const mapDataOptions = (data = [], options = {}) => {
  const { valueName = 'id', labelName = 'name', valueAsString = false } = options;
  return (Array.isArray(data) ? data : []).map((item) => {
    let { value } = item;
    value = Number(item[valueName]);
    if (valueAsString) {
      value = String(item[valueName]);
    }
    return { ...item, label: item[labelName], value };
  });
};

export const readImageAsBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const getBase64 = (file) => {
  if (file instanceof Blob)
    return new Promise((resolve) => {
      let baseURL = '';
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
      return baseURL;
    });
};

export const changeDate = (val) => {
  if (!val) return '';
  let str = val;
  str = str.trim();
  str = str.replace('thứ hai', 'T2');
  str = str.replace('thứ ba', 'T3');
  str = str.replace('thứ tư', 'T4');
  str = str.replace('thứ năm', 'T5');
  str = str.replace('thứ sáu', 'T6');
  str = str.replace('thứ bảy', 'T7');
  str = str.replace('chủ nhật', 'CN');

  str = str.replace('Mon', 'T2');
  str = str.replace('Tue', 'T3');
  str = str.replace('Wed', 'T4');
  str = str.replace('Thu', 'T5');
  str = str.replace('Fri', 'T6');
  str = str.replace('Sat', 'T7');
  str = str.replace('Sun', 'CN');
  str = str.trim();
  return str;
};

export const statusTypesOption = [
  {
    label: 'Tất cả',
    value: STATUS_TYPES.ALL,
  },
  {
    label: 'Kích hoạt',
    value: STATUS_TYPES.ACTIVE,
  },
  {
    label: 'Ẩn',
    value: STATUS_TYPES.HIDDEN,
  },
];

export const showWebTypesOption = [
  {
    label: 'Tất cả',
    value: STATUS_TYPES.ALL,
  },
  {
    label: 'Hiển thị',
    value: STATUS_TYPES.ACTIVE,
  },
  {
    label: 'Ẩn',
    value: STATUS_TYPES.HIDDEN,
  },
];


export const statusReviewOption = [
  {
    label: 'Tất cả',
    value: STATUS_REVIEW.ALL,
  },
  {
    label: 'Đã duyệt',
    value: STATUS_REVIEW.REVIEWED,
  },
  {
    label: 'Chưa duyệt',
    value: STATUS_REVIEW.REVIEWING,
  },
  {
    label: 'Không duyệt',
    value: STATUS_REVIEW.NOTREVIEW,
  },
];

export const genderTypesOptions = [
  {
    label: 'Tất cả',
    value: GENDER_TYPES.ALL,
  },
  {
    label: 'Nam',
    value: GENDER_TYPES.MALE,
  },
  {
    label: 'Nữ',
    value: GENDER_TYPES.FEMALE,
  },
];
export const deletedStatusOption = [
  {
    label: 'Tất cả',
    value: STATUS_TYPES.ALL,
  },
  {
    label: 'Có',
    value: STATUS_TYPES.ACTIVE,
  },
  {
    label: 'Không',
    value: STATUS_TYPES.HIDDEN,
  },
];

export const reviewStatusOption = [
  {
    label: 'Tất cả',
    value: REVIEW_STATUS_TYPES.ALL,
  },
  {
    label: 'Đã duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWED,
  },
  {
    label: 'Đang duyệt',
    value: REVIEW_STATUS_TYPES.REVIEWING,
  },
  {
    label: 'Chưa duyệt',
    value: REVIEW_STATUS_TYPES.NOTYETREVIEW,
  },
  {
    label: 'Không duyệt',
    value: REVIEW_STATUS_TYPES.NOREVIEW,
  },
];
export const stockInStatusOption = [
  {
    value: STATUS_STOCKS_IN.ALL,
    label: 'Tất cả',
  },
  {
    value: STATUS_STOCKS_IN.STOCKED,
    label: 'Đã nhập kho',
  },
  {
    value: STATUS_STOCKS_IN.NOTYETSTOCKED,
    label: 'Chưa nhập kho',
  },
];

export const budgetCreationOption = [
  {
    value: BUDGET_CREATION.ALL,
    label: 'Tất cả',
  },
  {
    label: 'Có',
    value: BUDGET_CREATION.HAVE,
  },
  {
    label: 'Không',
    value: BUDGET_CREATION.NOT_HAVE,
  },
];

export const returnConditionnOption = [
  {
    value: RETURN_CONDITION.ALL,
    label: 'Tất cả',
  },
  {
    label: 'Trả hàng',
    value: RETURN_CONDITION.ISRETURN,
  },
  {
    label: 'Đổi hàng',
    value: RETURN_CONDITION.ISEXCHANGE,
  },
];

export const IsSystemOption = [
  {
    value: SYSTEM_OPTIONS.ALL,
    label: 'Tất cả',
  },
  {
    value: SYSTEM_OPTIONS.ACTIVE,
    label: 'Hệ thống',
  },
  {
    value: SYSTEM_OPTIONS.HIDDEN,
    label: 'Ẩn',
  },
];

export const removeCharactersVietnamese = (str) => {
  // remove accents
  var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '');

  return str;
};

export const defaultPaging = {
  items: [],
  itemsPerPage: 0,
  page: 0,
  totalItems: 0,
  totalPages: 0,
};

export const defaultParams = {
  is_active: 1,
  page: 1,
  itemsPerPage: 25,
};

export const MAX_ITEM_PER_PAGE = 25;

export const generateUUID = () => {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const isFunctionComponent = (component) => {
  return typeof component === 'function' && String(component).includes('return React.createElement');
};

export const typeNotifyOptions = [
  {
    value: TYPE_NOTIFY.MAIL,
    label: 'Danh sách mail',
    icon: 'fi-rr-envelope-open-text',
    //#url api
    apiUrl: 'global/notify',
    redirectUrl: (id, children_id) => {
      if (children_id) {
        return 'mail/detail/' + id + '?children_id=' + children_id;
      }
      return 'mail/detail/' + id;
    },
  },
  {
    value: TYPE_NOTIFY.ANNOUNCE,
    label: 'Danh sách thông báo',
    apiUrl: 'global/notify',
    icon: 'fi-rr-bell',
    redirectUrl: (id) => {
      return 'notification/detail/' + id;
    },
  },
];

export const toastSuccess = (msg) => {
  toast.success(msg ?? 'Thành công', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

export const toastError = (msg) => {
  toast.error(msg ?? 'Có lỗi xảy ra', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

export const toastWarning = (msg) => {
  toast.warning(msg ?? 'Có lỗi xảy ra', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

const toastOptions = {
  position: 'top-right',
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const showToast = {
  success: (msg) => {
    toast.success(msg || 'Chỉnh sửa thành công', toastOptions);
  },
  error: (msg) => {
    toast.error(msg ?? 'Có lỗi xảy ra', toastOptions);
  },
  warning: (msg) => {
    toast.warning(msg ?? 'Có lỗi xảy ra', toastOptions);
  },
  warn: (msg) => {
    toast.warning(msg ?? 'Có lỗi xảy ra', toastOptions);
  },
  info: (msg) => {
    toast.info(msg ?? 'Có lỗi xảy ra', toastOptions);
  },
};

export const capitalizedString = (value) => {
  return typeof value === 'string' && value.charAt(0).toUpperCase() + value.slice(1);
};

export const convertFieldFromArray = (value) => {
  return Array.isArray(value) && value.reduce((a, b) => a + capitalizedString(b));
};

export const createDownloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

export const downloadFileUrl = async (url, fileName) => {
  const blob = await fetch(url).then((r) => r.blob());
  createDownloadFile(blob, fileName ? fileName : url.split('/').pop());
};

export const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export const getOptionSelected = (options = [], value) => {
  return options.find((item) => item.value === value) || {};
};

export const wrappedOptionAll = (options = [], label = 'Tất cả', valueAsString = false) => {
  return [
    {
      label,
      value: valueAsString ? '-1' : -1,
    },
    ...(options?.length ? options : []),
  ];
};

export const makeId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  result = result.toUpperCase();
  return result;
};

export const sliceText = (text = '', number = 50, numberToSlice = 47) => {
  if (!text) {
    text = '';
  }
  let resultTextSlice = '';
  resultTextSlice = text.length > number ? text.slice(0, numberToSlice) + '...' : text;
  return resultTextSlice;
};

export const renderItemSplit = (dataSplit = '', symbolSplit = '|') => {
  return (
    <div className='text-left'>
      {(dataSplit || '').split(symbolSplit).map((_name, i) => {
        return (
          <ul key={i}>
            <li>
              <p>{_name}</p>
            </li>
          </ul>
        );
      })}
    </div>
  );
};

export const formatNumber = (n, p, ts, dp) => {
  var t = [];
  // Get arguments, set defaults
  if (typeof p == 'undefined') p = 2;
  if (typeof ts == 'undefined') ts = ',';
  if (typeof dp == 'undefined') dp = '.';

  // Get number and decimal part of n
  n = Number(n).toFixed(p).split('.');

  // Add thousands separator and decimal point (if requied):
  for (var iLen = n[0].length, i = iLen ? iLen % 3 || 3 : 0, j = 0; i <= iLen; i += 3) {
    t.push(n[0].substring(j, i));
    j = i;
  }
  // Insert separators and return result
  return t.join(ts) + (n[1] ? dp + n[1] : '');
};

export function mapDataOptions4SelectCustomByType(data, valueName = 'value', labelName = 'label', type = 'string') {
  return (Array.isArray(data) ? data : []).map((_item) => {
    let item = { ..._item };
    let { id, name, label, value } = item;
    label = name || item[labelName];
    switch (type) {
      case 'string':
        value = `${id}` || `${item[valueName]}`;
        break;
      case 'number':
        value = 1 * id || 1 * item[valueName];
        break;
      default:
        value = 1 * id || 1 * item[valueName];
    }
    return { ..._item, label, value };
  });
}

export const emptyCheck = (value) => {
  const result = value && Object.keys(value).length === 0 && value.constructor === Object;
  return result;
};

export const getRandomSubarray = (arr, n) => {
  const shuffled = arr.slice();
  let i = arr.length;
  const min = i - n;
  while (i-- > min) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
};

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}