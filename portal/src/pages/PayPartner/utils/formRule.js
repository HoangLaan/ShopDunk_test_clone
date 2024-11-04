export const PHONE_RULE = {
  required: false,
  pattern: {
    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
    message: 'Số điện thoại không hợp lệ.',
  },
};

export const EMAIL_RULE = {
  required: false,
  pattern: {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: 'Email không đúng định dạng',
  },
};
