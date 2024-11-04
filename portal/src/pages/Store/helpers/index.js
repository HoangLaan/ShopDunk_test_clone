import { SIZE_TYPE, STORE_STATUS_TYPE } from './constants';

export const getTabError = (errors, tab) => {
  if (!Object.keys(errors).length) return tab;
  if (
    errors['password'] ||
    errors['first_name'] ||
    errors['last_name'] ||
    errors['department_id'] ||
    errors['position_id'] ||
    errors['level_id'] ||
    errors['hard_salary'] ||
    errors['birthday'] ||
    errors['entry_date'] ||
    errors['phone_number'] ||
    errors['email'] ||
    errors['current_country_id'] ||
    errors['current_province_id'] ||
    errors['current_district_id'] ||
    errors['current_ward_id'] ||
    errors['current_address'] ||
    errors['bank_users'] ||
    errors['user_groups']
  ) {
    return 'info';
  }
  return 'hr';
};

const SECTION = {
  info: [
    'store_code',
    'store_name',
    // 'banner_url',
    'architecture_type',
    'brand_id',
    'area_id',
    'company_id',
    'phone_number',
    'store_type_id',
    'status_type',
    // 'open_time',
    // 'close_time',
    'business_id',
  ],
  ip: ['ips'],
  image: ['images'],
  status: ['is_active'],
  address: ['country_id', 'province_id', 'ward_id', 'district_id', 'address', 'location_x', 'location_y'],
  bank_info: ['bank_accounts'],
};

export const getControlActive = (section = null, watch) => {
  if (!SECTION[section]) return false;
  const fields = SECTION[section];
  let isActive = true;
  for (let i in fields) {
    if (!Boolean(watch(fields[i]))) {
      isActive = false;
      break;
    }
  }
  return isActive;
};

export const storeStatusOptions = [
  {
    label: 'Đang hoạt động',
    value: STORE_STATUS_TYPE.ACTIVE,
  },
  {
    label: 'Dừng bảo trì',
    value: STORE_STATUS_TYPE.MAINTENANCE,
  },
  {
    label: 'Dừng hoạt động',
    value: STORE_STATUS_TYPE.STOP_OPERATION,
  },
];

export const sizeTypeOptions = Object.values(SIZE_TYPE).map((value, index) => {
  return {
    label: value,
    value: index + 1,
  };
});
