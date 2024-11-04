/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import ModalUserCare from '../Modals/ModalUserCare';
import { ruleRatio } from 'pages/TaskType/utils/formRules';
import { showToast } from 'utils/helpers';
import { DIVIDE_BY } from 'pages/TaskType/utils/constants';
import { calcGridRatioValue } from 'pages/TaskType/utils/utils';
import usePagination from 'hooks/usePagination';
import FormDivide from './FormDivide';

const FIELD_LIST = 'receiver_list';

const FormReceiver = ({ title, disabled }) => {
  const methods = useFormContext();
  const { watch, control } = methods;
  const { remove } = useFieldArray({ control, name: FIELD_LIST });

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const is_divide = watch('is_divide');
  const receiver_list = watch(FIELD_LIST) || [];

  const pagination = usePagination({ data: receiver_list, itemsPerPage: 10 })

  // useDetectHookFormChange(methods)

  const onChangeValueRatio = (field, value, index) => {
    methods.clearErrors(field);
    const valueInt = parseInt(value);
    if (isNaN(valueInt)) {
      methods.setValue(field, null);
      return;
    }
    const _receiver_list = [...receiver_list];
    _receiver_list[index].value_ratio = valueInt;
    const { remainRatio, list: new_receiver_list } = calcGridRatioValue(_receiver_list);
    if (remainRatio < 0) {
      showToast.error('Tổng tỷ lệ không được lớn hơn 100');
      return;
    }
    methods.setValue(FIELD_LIST, new_receiver_list);
  };

  const columns = useMemo(() => {
    return [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, idx) => _.dataIndex + 1,
      },
      {
        header: 'Họ và tên',
        accessor: 'full_name',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
      },
      {
        header: 'Tỷ lệ',
        hidden: is_divide === DIVIDE_BY.IS_GET_DATA,
        formatter: (_, index) => {
          const field = `receiver_list.${_.dataIndex}.value_ratio`;
          return (
            <FormNumber
              bordered={true}
              field={field}
              validation={ruleRatio}
              disabled={disabled || is_divide === DIVIDE_BY.IS_EQUAL_DIVIDE}
              onChange={(value) => onChangeValueRatio(field, value, _.dataIndex)}
              addonAfter='%'
            />
          );
        },
      },
    ];
  }, [is_divide, onChangeValueRatio]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn nhân viên',
        disabled: disabled,
        onClick: () => setOpen(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        disabled: disabled,
        onClick: (item, index) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => remove(index),
            ),
          ),
      },
    ];
  }, []);

  return (
    <BWAccordion title={title}>
      <DataTable
        selectedHidden
        hiddenDeleteClick
        actions={actions}
        columns={columns}
        noSelect
        selectable
        data={pagination.items}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onChangePage={pagination.onChangePage}
      />
      {open && (
        <ModalUserCare
          open={open}
          onClose={() => setOpen(false)}
          onApply={(data) => methods.setValue(FIELD_LIST, data)}
          defaultDataSelect={receiver_list}
        />
      )}
    </BWAccordion>
  );
};

export default FormReceiver;
