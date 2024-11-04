const validateSpecialCharacters = (value) => {
  return /^[a-zA-Z0-9\s]*$/.test(value) || 'Không được phép chứa ký tự đặc biệt.';
};

const validateMin250 = (value) => {
  return value.length < 250 || 'Không được lớn hơn 250 ký tự.';
};

const validatePositiveNumber = (value) => {
  return value > 0 || 'Phải là số nguyên dương.';
};

export const msgError = {
  budget_type_id: { required: 'Loại ngân sách là bắt buộc' },
  budget_code: { required: 'Mã ngân sách là bắt buộc', validate: { validateSpecialCharacters, validateMin250 } },
  short_name: { required: 'Tên ngân sách viết tắt là bắt buộc', validate: { validateMin250 } },
  budget_name: { required: 'Tên ngân sách đầy đủ  là bắt buộc', validate: { validateMin250 } },
  budget_type_name: { required: 'Tên nguyên tắt là bắt buộc' },
  budget_value: { required: 'Giá trị là bắt buộc', validate: { validatePositiveNumber } },
  measure: { required: 'Cách tính là bắt buộc' },
  budget_value_type: { required: 'Đơn vị tính là bắt buộc' },
  criteria: { required: 'Tiêu chí là bắt buộc' },
  apply_date: { required: 'Khoảng thời gian là bắt buộc' },
  model_error: ['Bạn có thật sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
};
