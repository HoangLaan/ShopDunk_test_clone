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

export const phoneSecondaryRule = {
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
}