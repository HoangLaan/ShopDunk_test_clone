export const phoneRule = {
  required: 'Số điện thoại là bắt buộc.',
  pattern: {
    value: /^[0-9]+$/,
    message: 'Số điện thoại phải là số.',
  },
  maxLength: {
    value: 10,
    message: 'Số điện thoại không hợp lệ.',
  },
  minLength: {
    value: 10,
    message: 'Số điện thoại không hợp lệ.',
  },
};

export const validateAddressBook = (data = []) => {
  const defaultAddressIndex = data.findIndex((item) => item.is_default === 1);
  return defaultAddressIndex !== -1;
};

function removeAscent(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

export function isValid(string) {
  var re = /^([A-Za-z\s'-]+)$/g;
  return re.test(removeAscent(string));
}
