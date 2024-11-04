import { TYPE_VALUE } from './constants';
import { formatMoney } from './utils';

export const getCommissionValueRule = (watchType, isRequired = true) => {
  return {
    required: isRequired ? 'Giá trị là bắt buộc' : undefined,
    min: {
      value: 0.00000001,
      message: 'Giá trị phải lớn hơn 0',
    },
    max: {
      value: parseInt(watchType) === TYPE_VALUE.PERCENT ? 100 : undefined,
      message: 'Giá trị không được lớn hơn 100',
    },
  };
};

export const validateCommissionValues = (dataSubmit) => {
  const totalDepartment = dataSubmit.departments.reduce((acc, item) => {
    return acc + Number(item.commission_value);
  }, 0);

  // Check đvt là đồng
  if (parseInt(dataSubmit.type_value) === TYPE_VALUE.MONEY) {
    // Check hoa hồng áp dụng cho phòng ban theo loại đơn hàng
    if (totalDepartment !== parseInt(dataSubmit.commission_value)) {
      throw new Error(
        `Tổng giá trị hoa hồng áp dụng cho phòng ban phải bằng ${formatMoney(
          dataSubmit.commission_value,
        )}đ, hiện tại là ${formatMoney(totalDepartment)}đ`,
      );
    }

    // Check hoa hồng áp dụng cho vị trí - chức vụ
    if (parseInt(dataSubmit.is_divide_to_position) === 1) {
      for (let i = 0; i < dataSubmit.departments.length; i++) {
        const { department_id, department_name, commission_value } = dataSubmit.departments[i];
        const departmentValue = Number(commission_value);
        const totalPosition = dataSubmit.positions
          ?.filter((position) => parseInt(position.department_id) === parseInt(department_id))
          ?.reduce((acc, item) => {
            return acc + Number(item.commission_value || 0);
          }, 0);

        if (totalPosition !== departmentValue) {
          throw new Error(
            `Tổng giá trị hoa hồng áp dụng cho vị trí - chức vụ của phòng "${department_name}" phải bằng ${formatMoney(
              departmentValue,
            )}đ, hiện tại là ${formatMoney(totalPosition)}đ`,
          );
        }
      }
    }
  }

  // Check đvt là phần trăm
  if (parseInt(dataSubmit.type_value) === TYPE_VALUE.PERCENT) {
    if (totalDepartment !== 100) {
      throw new Error('Tổng giá trị hoa hồng áp dụng cho phòng ban phải bằng 100%');
    }

    // Check hoa hồng áp dụng cho vị trí - chức vụ
    if (parseInt(dataSubmit.is_divide_to_position) === 1) {
      for (let i = 0; i < dataSubmit.departments.length; i++) {
        const { department_name, department_id } = dataSubmit.departments[i];
        const totalPosition = dataSubmit.positions
          ?.filter((position) => parseInt(position.department_id) === parseInt(department_id))
          ?.reduce((acc, item) => {
            return acc + Number(item.commission_value || 0);
          }, 0);

        if (parseInt(totalPosition) !== 100) {
          throw new Error(
            `Tổng giá trị hoa hồng áp dụng cho vị trí - chức vụ của phòng "${department_name}" phải bằng 100%`,
          );
        }
      }
    }
  }
};
