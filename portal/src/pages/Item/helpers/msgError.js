const validateSpecialCharacters = (value) => {
  return /^[a-zA-Z0-9\s]*$/.test(value) || 'Không được phép chứa ký tự đặc biệt.';
};

const validateMin = (value) => {
  return value.length < 10 || 'Không được lớn hơn 10 ký tự.';
};

export const msgError = {
  item_name: { required: 'Tên khoản mục là bắt buộc' },
  item_code: { required: 'Mã khoản mục là bắt buộc', validate: { validateSpecialCharacters, validateMin } },
  company_id: { required: 'Công ty áp dụng là bắt buộc' },
  model_error: ['Bạn có thật sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
};