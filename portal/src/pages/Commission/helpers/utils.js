import { showToast } from 'utils/helpers';
import _ from 'lodash';

export const mapDataOptions4Select = (data, valueName = 'value', labelName = 'label') => {
  return (data || []).map((_item) => {
    let item = { ..._item };
    let { id, name, label, value } = item;
    label = name || item[labelName];
    value = id || item[valueName];
    return { ..._item, label, value: Number(value) };
  });
};

export const removeObjectKeys = (obj, keysToRemove) => {
  return keysToRemove.reduce(
    (acc, key) => {
      delete acc[key];
      return acc;
    },
    { ...obj },
  );
};

export const uniqueArr = (arr, key) => {
  return Array.from(new Map(arr.map((item) => [item[key], item])).values());
};

export const toastSuccess = (msg) => {
  showToast.success(msg ?? 'Thành công', {
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
  showToast.error(msg ?? 'Có lỗi xảy ra', {
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

const SECTION = {
  bw_info: ['commission_name', 'start_date', 'end_date', 'company_id', 'business_apply', 'stores'],
  bw_type_apply_1: ['commission_type_id', 'type_value', 'commission_value', 'order_types'],
  bw_type_apply_2: ['commission_type_id', 'type_value', 'commission_value', 'error_groups'],
  bw_department: ['is_divide', 'departments'],
  bw_review: ['reviewed_user_department', 'reviewed_user', 'reviewed_note'],
  bw_status: ['is_active'],
};

export const getControlActive = (section = null, watch) => {
  if (!SECTION[section]) return false;
  const fields = SECTION[section];
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

export const handleScrollToFormItem = (id) => {
  const violation = document.getElementById(id);
  window.scrollTo({
    top: violation.offsetTop - 50,
    behavior: 'smooth',
  });
};

export const formatMoney = (val) => {
  if (!val) return '';
  return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
