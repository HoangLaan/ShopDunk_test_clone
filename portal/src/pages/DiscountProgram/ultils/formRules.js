import { CurrencyType } from './constant';

export const getCurrencyTypeRule = (watchType, isRequired = true) => {
  return {
    required: isRequired ? 'Giá trị là bắt buộc' : undefined,
    min: {
      value: 0.00000001,
      message: 'Giá trị phải lớn hơn 0',
    },
    max: {
      value: parseInt(watchType) === CurrencyType.PERCENT ? 100 : undefined,
      message: 'Giá trị không được lớn hơn 100',
    },
  };
};
