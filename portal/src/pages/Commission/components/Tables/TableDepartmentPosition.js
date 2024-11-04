import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import { getDepartmentPositionV2 } from 'services/commission.service';
import FormTwoType from '../FormTwoType/FormTwoType';
import { usePagination } from 'pages/Commission/helpers/hooks';
import ICON_COMMON from 'utils/icons.common';
import { COMMISSION_PERMISSION } from 'pages/Commission/helpers/constants';

const TableDepartmentPosition = ({ disabled }) => {
  const { watch, setValue, control } = useFormContext();
  const positionListField = useFieldArray({ control, name: 'position_list' });

  const commissionId = watch('commission_id');
  const watchDepartments = watch('departments');
  const watchDepartmentIds = watchDepartments?.map((d) => d.department_id).join();
  const watchCommissionTypeValue = watch('type_value');

  const [params, setParams] = useState({
    is_active: 1,
    commission_id: commissionId,
    department_ids: watchDepartmentIds,
  });

  const data = watch('position_list') || [];
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({ data });

  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getDepartmentPositionV2(params);
    const positionsData = (Array.isArray(data) ? data : []).map((item) => ({
      ...item,
      type_value: watchCommissionTypeValue,
    }));
    setValue('position_list', positionsData);
    setLoading(false);
  }, [params, setValue, watchCommissionTypeValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (params.department_ids !== watchDepartmentIds) {
      setParams((p) => ({ ...p, page: 1, department_ids: watchDepartmentIds }));
    }
  }, [watchDepartmentIds, params]);

  const columns = useMemo(() => {
    const startPageIndex = (page - 1) * itemsPerPage;
    return [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => <b className='bw_sticky bw_name_sticky'>{index + 1 + startPageIndex}</b>,
      },
      {
        header: 'Vị trí - chức vụ',
        accessor: 'position_name',
      },
      {
        header: 'Tên phòng ban',
        accessor: 'department_name',
      },
      {
        header: 'Thuộc phòng ban',
        accessor: 'parent_department_name',
      },
      {
        header: 'Giá trị hoa hồng',
        formatter: (value, index) => (
          <div className='bw_flex bw_align_items_center bw_relative'>
            <FormTwoType
              fieldType={`position_list.${startPageIndex + index}.type_value`}
              fieldValue={`position_list.${startPageIndex + index}.commission_value`}
              disabled={disabled}
              initType={watchCommissionTypeValue}
              isRequired={false}
            />
          </div>
        ),
      },
    ];
  }, [page, itemsPerPage, watchCommissionTypeValue, disabled]);

  const actions = useMemo(() => {
    const startPageIndex = (page - 1) * itemsPerPage;
    return [
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: COMMISSION_PERMISSION.EDIT,
        hidden: disabled,
        onClick: (p, idx) => {
          positionListField.remove(startPageIndex + idx);
        },
      },
    ];
  }, [page, itemsPerPage, disabled, positionListField]);

  return (
    <DataTable
      noSelect={true}
      loading={loading}
      columns={columns}
      actions={actions}
      data={rows}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      page={page}
      onChangePage={onChangePage}
    />
  );
};

export default TableDepartmentPosition;
