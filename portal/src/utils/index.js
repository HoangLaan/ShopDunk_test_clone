import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import moment from 'moment';

export const getErrorMessage = (error, msg = 'Đã có lỗi xảy ra. Vui lòng F5 thử lại') => {
  if (typeof error === 'string') return error;

  if (error instanceof Array) {
    let objErr = {};
    error.forEach((err) => {
      objErr[err.key] = err.msg;
    });
    return JSON.stringify(objErr);
  }

  let _message = '';

  if (typeof error === 'object') {
    let { message = '', errmsg = '' } = error || {};
    _message = message || msg || errmsg;
  } else {
    _message = msg;
  }
  return _message;
};

export const formatter = (data, parentPath = '', parentAuthority) => {
  return data.map((item) => {
    const result = {
      ...item,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority);
      result.children = children;
    }
    delete result.routes;
    return result;
  });
};

export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
};

export const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt='icon' className={'icon'} />;
  }
  if (typeof icon === 'string') {
    return <i className={classNames(icon)} />;
  }
  return icon;
};

export function getNestedParent(arr, path) {
  let result;
  arr.some(({ id, url, children = [] }) => {
    if (path.includes(url)) return (result = id);
    var temp = getNestedParent(children, path);
    if (temp) return (result = id + '.' + temp);
  });
  return result;
}

export function getNestedParentMenuToArray(arr, path, isShift = true) {
  const list = getNestedParent(arr, path);
  if (!list) return [];
  let arrMenu = list.split('.');
  if (arrMenu.length <= 1) return arrMenu;
  return isShift ? arrMenu.slice(1) : arrMenu;
}

export function findIdWhereChild(data, input, key) {
  if (data.children?.find((x) => x[key] == input)) {
    return data[key];
  } else {
    if (data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        let findalResult = findIdWhereChild(data.children[i], input, key);
        if (findalResult) {
          return findalResult;
        }
      }
    } else {
      return undefined;
    }
  }
}

export function findParents(node, key) {
  if (node.key === key) {
    return [];
  }
  if (Array.isArray(node.children)) {
    for (var treeNode of node.children) {
      const childResult = findParents(treeNode, key);
      if (Array.isArray(childResult)) {
        return [treeNode.key].concat(childResult);
      }
    }
  }
}

export function getItem(name, path, label, key, icon, children, type) {
  return {
    key,
    path,
    icon,
    children,
    label,
    type,
    name,
  };
}

export function urlToList(url) {
  const urllist = url.split('/').filter((i) => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

export function getMenuMatchKeys(flatMenuKeys, paths) {
  return paths.reduce(
    (matchKeys, path) => matchKeys.concat(flatMenuKeys.filter((item) => pathToRegexp(item).test(path))),
    [],
  );
}

export const getMenuMatches = (flatMenuKeys, path) => {
  return flatMenuKeys.filter((item) => item.link_menu && pathToRegexp(item.link_menu).test(path));
};

export const getAllParentId = (list, id) => {
  let ids = [];
  const getParent = (data, id, ids) => {
    let menu = data.find((p) => p.menu_id === id) || {};
    if (menu && menu.parent_id && menu.parent_id != 0) {
      ids.push(menu.parent_id);
      getParent(data, menu.parent_id, ids);
    }
  };
  getParent(list, id, ids);
  return (ids || []).reverse();
};

/**
 * Is plain object?
 * @return {bool|mixed}
 */
export const isPlainObject = (data, rtnData) => {
  let rs = '[object Object]' === Object.prototype.toString.call(data);
  return undefined !== rtnData ? (rs ? data : rtnData) : rs;
};

export function splitString(str, n, useWordBoundary = true) {
  if (!str) return '';
  if (str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1);
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + ' ...';
}

const pad = (num, size) => {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

export const buildSku = (stocks_id = '', count = 0, rightNum = 5, date = moment().format('YYMMDD')) => {
  count = count + 1;
  count = pad(count, rightNum);
  return `${pad(stocks_id, 4)}${date}${count}`;
};

export const toObject = (arr = [], key, addon = {}) => {
  if (!key || !arr.length) return {};
  return (arr || []).reduce((_obj, o, i) => {
    _obj[o[key]] = Object.assign(o, addon);
    return _obj;
  }, {});
};

export function formatPrice(x, isShow = false, type = '.') {
  if (!x) return '0' + (isShow ? ' VND' : '');
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, type) + (isShow ? ' VND' : '');
}

export function formatPricePurchaseOrder(inputNumber) {
  if (!inputNumber) return '0';
  // Làm tròn số với hai chữ số thập phân
  const roundedNumber = parseFloat(inputNumber).toFixed(2);
  // Chuyển đổi số đã làm tròn thành chuỗi
  const numberString = roundedNumber.toString();
  // Tách phần nguyên và phần thập phân
  const [integerPart, decimalPart] = numberString.split('.');
  // Thêm dấu phân cách hàng nghìn vào phần nguyên
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Kết hợp lại và trả về chuỗi đã định dạng
  return `${formattedIntegerPart}.${decimalPart}`;
}

export function formatVND(number) {
  if (!number) return '';
  return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

export function formatMoney(number) {
  if (!number) return '';
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// @var {String}
const CDN = process.env.REACT_APP_CDN || '';
/**
 * Get path with prefix of project's cdn
 * @param {String} path
 * @return {String}
 */
export function cdnPath(path) {
  let _p = '';
  path = (path || '').replace(/\\/g, '/');
  if (path.match(/^\w+:/)) {
    _p = path;
  } else {
    _p = (path ? `${CDN}/${path || ''}` : '').replace(/\/{3,}/g, '/');
  }
  return _p;
}
export function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

export function invertHex(hex) {
  return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
}

export function checkValueNone(valueCheck, valueReturn = '') {
  let result = undefined;
  result = valueReturn;
  if (valueCheck) {
    result = valueCheck;
  }
  return result;
}

export const getCurrentDate = () => moment().format('L');

export const addDays = (dateCurrent = moment(new Date()).utc().format(), days, format = 'dd/MM/yyyy') => {
  const expirationDate = moment(dateCurrent).add(days, 'd');
  return expirationDate.format(format);
};

export const checkEmptyArray = (value) => {
  if (value && Array.isArray(value) && value.length > 0) {
    return true;
  }

  return false;
};

export const stringToArray = (value = '', syb = '|') => {
  let result = [];
  if (value) {
    let stringValue = value.toString();
    result = (stringValue || '').split(syb);
  }
  return result;
};

export const disabledDatePrevious = (currentDate, format = 'YYYY-MM-DD') => {
  const customDate = moment().format(format);
  return currentDate && currentDate < moment(customDate, format);
};


export function returnDebitAccountCode(orderType) {
  let codeDebitAccount;
  switch (orderType) {
    case 1:
      codeDebitAccount = '511111';
      break;
    case 2:
      codeDebitAccount = '511111';
      break;
    case 10:
      codeDebitAccount = '511111';
      break;
    case 3:
      codeDebitAccount = '511112';
      break;
    case 6:
      codeDebitAccount = '511113';
      break;
    case 9:
      codeDebitAccount = '511114';
      break;
    case 12:
      codeDebitAccount = '511113';
      break;
    case 11:
      codeDebitAccount = '511116';
      break;
    default:
      codeDebitAccount = '511115';
  }
  return codeDebitAccount;
}

export function formatPriceNegative(x, type = ',') {
  if (!x) return '0'
  if(+x < 0){
    return <><span style={{color: 'red'}}>{'(' + Math.abs(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, type) + ')'}</span></>
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, type)

}