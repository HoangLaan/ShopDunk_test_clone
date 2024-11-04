import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import FormTwoType from '../FormTwoType/FormTwoType';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import { COMMISSION_PERMISSION } from 'pages/Commission/helpers/constants';

function TableDepartment({ disabled, onRemoveItem }) {
  const { watch } = useFormContext();
  const { setIsOpenModalDepartment } = useCommissionContext();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => <b className='bw_sticky bw_name_sticky'>{index + 1}</b>,
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
      },
      {
        header: 'Thuộc phòng ban',
        accessor: 'parent_name',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
      },
      {
        header: 'Giá trị hoa hồng',
        formatter: (value, index) => (
          <div className='bw_flex bw_align_items_center bw_relative'>
            <FormTwoType
              fieldType={`departments.${index}.type_value`}
              fieldValue={`departments.${index}.commission_value`}
              disabled={disabled}
            />
          </div>
        ),
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn phòng ban',
        hidden: disabled,
        permission: [COMMISSION_PERMISSION.ADD, COMMISSION_PERMISSION.EDIT],
        onClick: () => {
          setIsOpenModalDepartment(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: [COMMISSION_PERMISSION.ADD, COMMISSION_PERMISSION.EDIT],
        onClick: (value, index) => {
          onRemoveItem(index, value);
        },
      },
    ];
  }, [disabled, onRemoveItem, setIsOpenModalDepartment]);

  return (
    <div>
      <DataTable
        hiddenActionRow
        noPaging
        noSelect
        data={watch('departments')}
        columns={columns}
        actions={actions}
        // loading={loading}
      />
    </div>
  );
}

export default TableDepartment;
