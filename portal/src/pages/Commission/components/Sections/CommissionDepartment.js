import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { DIVIDE_BY } from 'pages/Commission/helpers/constants';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import TableDepartmentPosition from '../Tables/TableDepartmentPosition';
import ModalDepartment from '../Modals/ModalDepartment';
import TableDepartment from '../Tables/TableDepartment';

function CommissionDepartment({ disabled, title }) {
  const { isOpenModalDepartment, setIsOpenModalDepartment } = useCommissionContext();
  const { watch, control, register, getValues, setValue } = useFormContext();
  const watchIsDivideToPosition = watch('is_divide_to_position');
  const watchCommissionTypeValue = watch('type_value');

  const {
    fields: departmentGroupFields,
    append: appendDepartment,
    remove: removeDepartment,
    replace: replaceDepartments,
  } = useFieldArray({
    control: control,
    name: 'departments',
  });

  const onConfirmModalDepartment = (attributesSelected) => {
    const attributesSelectedId = Object.keys(attributesSelected);
    for (let i = 0; i < attributesSelectedId.length; i++) {
      const id = attributesSelectedId[i];
      const index = departmentGroupFields.findIndex((item) => {
        return parseInt(item.department_id) === parseInt(id);
      });
      if (index === -1) {
        appendDepartment({
          ...attributesSelected[id],
          type_value: watchCommissionTypeValue,
          commission_value: null,
        });
      }
    }

    setIsOpenModalDepartment(false);
  };

  const onRemoveDepartmentItem = (index, field) => {
    removeDepartment(index);

    const positionValue = getValues('positions');
    if (positionValue?.length) {
      const newPositionValue = positionValue.filter((item) => {
        return parseInt(item.department_id) !== parseInt(field.department_id);
      });
      setValue('positions', newPositionValue);
    }
  };

  useEffect(() => {
    // kiểm tra trước khi đổi kiểu hoa hồng tránh lặp vô tận
    if (
      !watchCommissionTypeValue ||
      !departmentGroupFields[0] ||
      parseInt(watchCommissionTypeValue) === parseInt(departmentGroupFields[0]?.type_value)
    )
      return;

    const newDepartmentGroupFields = departmentGroupFields.map((item) => {
      return {
        ...item,
        type_value: watchCommissionTypeValue,
      };
    });
    replaceDepartments(newDepartmentGroupFields);
  }, [watchCommissionTypeValue, replaceDepartments, departmentGroupFields]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              type='radio'
              value={1}
              {...register('is_divide')}
              checked={parseInt(watch('is_divide')) === DIVIDE_BY.BY_DEPARTMENT}
              disabled={disabled}
            />
            <span />
            Áp dụng hoa hồng cho tất cả nhân viên trong phòng ban
          </label>
          <label className='bw_radio bw_mt_1'>
            <input
              type='radio'
              value={2}
              {...register('is_divide')}
              checked={parseInt(watch('is_divide')) === DIVIDE_BY.BY_SHIFT}
              disabled={disabled}
            />
            <span />
            Áp dụng hoa hồng cho các nhân viên trong ca làm việc
          </label>
          <label className='bw_radio bw_mt_1'>
            <input
              type='radio'
              value={3}
              {...register('is_divide')}
              checked={parseInt(watch('is_divide')) === DIVIDE_BY.TO_SALE_EMPLOYEE}
              disabled={disabled}
            />
            <span />
            Áp dụng hoa hồng cho các nhân viên có mặt trên chứng từ
          </label>
        </div>
      </div>
      <TableDepartment disabled={disabled} onRemoveItem={onRemoveDepartmentItem} />
      <div className='bw_mt_2'>
        <div className='bw_flex bw_align_items_center bw_lb_sex'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field='is_divide_to_position' disabled={disabled} />
            <span />
            Hoa hồng chia theo vị trí - chức vụ
          </label>
        </div>
      </div>
      {!!watchIsDivideToPosition && departmentGroupFields?.length > 0 && (
        <TableDepartmentPosition disabled={disabled} />
      )}
      {isOpenModalDepartment && <ModalDepartment onConfirm={onConfirmModalDepartment} />}
    </BWAccordion>
  );
}

export default CommissionDepartment;
