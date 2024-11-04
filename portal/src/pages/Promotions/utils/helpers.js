import { MONTH_ENUM, TYPE_REVIEW, WEEK_ENUM } from "./constants";

const weekOptions = [
  {
    label: 'Thứ 2',
    value: WEEK_ENUM.MONDAY,
    field: 'is_apply_mon'
  },
  {
    label: 'Thứ 3',
    value: WEEK_ENUM.TUESDAY,
    field: 'is_apply_tu'
  },
  {
    label: 'Thứ 4',
    value: WEEK_ENUM.WEDNESDAY,
    field: 'is_apply_we'
  },
  {
    label: 'Thứ 5',
    value: WEEK_ENUM.THURSDAY,
    field: 'is_apply_th'
  },
  {
    label: 'Thứ 6',
    value: WEEK_ENUM.FRIDAY,
    field: 'is_apply_fr'
  },
  {
    label: 'Thứ 7',
    value: WEEK_ENUM.SATURDAY,
    field: 'is_apply_sa'
  },
  {
    label: 'Chủ nhật',
    value: WEEK_ENUM.SUNDAY,
    field: 'is_apply_sun'
  }
]

const monthOptions = [
  {
    label: 'Tháng 1',
    value: MONTH_ENUM.JANUARY
  },
  {
    label: 'Tháng 2',
    value: MONTH_ENUM.FEBRUARY
  },
  {
    label: 'Tháng 3',
    value: MONTH_ENUM.MARCH
  },
  {
    label: 'Tháng 4',
    value: MONTH_ENUM.APRIL
  },
  {
    label: 'Tháng 5',
    value: MONTH_ENUM.MAY
  },
  {
    label: 'Tháng 6',
    value: MONTH_ENUM.JUNE
  },
  {
    label: 'Tháng 7',
    value: MONTH_ENUM.JULY
  },
  {
    label: 'Tháng 8',
    value: MONTH_ENUM.AUGUST
  },
  {
    label: 'Tháng 9',
    value: MONTH_ENUM.SEPTEMBER
  },
  {
    label: 'Tháng 10',
    value: MONTH_ENUM.OCTOBER
  },
  {
    label: 'Tháng 11',
    value: MONTH_ENUM.NOVEMBER
  },
  {
    label: 'Tháng 12',
    value: MONTH_ENUM.DECEMBER
  },
]

const reviewOptions = [{
  value: TYPE_REVIEW.PENDING,
  label: 'Đang chờ duyệt'
},
{
  value: TYPE_REVIEW.ACCPECT,
  label: 'Đã duyệt'
},
{
  value: TYPE_REVIEW.REJECT,
  label: 'Từ chối'
}
]

const DEFFEND_KEY_GET = 'GET';
const DEFFEND_KEY_SET = 'SET';

const getValueByField = (methods, field, value, key = DEFFEND_KEY_GET) => {
  let result = null;
  if(key === DEFFEND_KEY_GET) {
    result = methods.watch(field);
  } else if (key === DEFFEND_KEY_SET) {
    methods.setValue(field, value);
    result = value;
  }
  return result;
}

const checkEmptyArr = (value, valueDefault = false) => {
  let result = value;
  if (result === undefined || result.length == 0) {
    result = valueDefault;
  }
  return result;
}

function checkArgumentsArr(arr = []) {
  for(let i = 0; i < arr.length; i++) {
    let checkVal = checkEmptyArr(arr[i]);
    if(checkVal) {
      return true;
    }
  }
  return false;
}

const checkArrayAndUnshirt = (arr, valueInsert) => {
  let result = arr;
  if(arr && Array.isArray(arr) && arr.length > 0) {
    result = arr.push(valueInsert);
  }
  return result;
}

const mapArrayGetKey = (arr, key, valueNotGet = null, valueDefault = null) => {
  let result = valueDefault;
  const checkArr = Array.isArray(arr);
  let count = 0;
  if(checkArr) {
      arr.map((val, index) => {
          if(val) {
              if(val[key]) {
                  if(val[key] != valueNotGet) {
                      if(!count) {
                          result = [];
                      }
                      result.push(val[key]);
                      count++
                  }
              }
          }
      })
  }
  return result;
}

export {
  monthOptions,
  weekOptions,
  reviewOptions,
  DEFFEND_KEY_GET,
  DEFFEND_KEY_SET,
  getValueByField,
  checkArgumentsArr,
  checkArrayAndUnshirt,
  mapArrayGetKey,
}