const RulePercent = {
  // required: 'Tỷ lệ là bắt buộc',
  min: {
    value: 0,
    message: 'Tỷ lệ phải lớn hơn 0',
  },
  max: {
    value: 100,
    message: 'Tỷ lệ phải nhỏ hơn 100',
  },
};

const RulePrice = {
  required: 'Giá trị này là bắt buộc',
  min: {
    value: 0,
    message: 'Giá trị phải lớn hơn 0',
  },
};

export { RulePercent, RulePrice };
