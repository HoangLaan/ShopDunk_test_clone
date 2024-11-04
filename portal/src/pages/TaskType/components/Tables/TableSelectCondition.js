/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DatabaseTwoTone } from '@ant-design/icons';

import usePagination from 'hooks/usePagination';
import DataTable from 'components/shared/DataTable/index';
import { PERMISSION } from 'pages/TaskType/utils/constants';
import TaskTypeService from 'services/task-type.service';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';

function TableSelectCondition({ params, defaultCondition }) {
  const { dataRowsCondition, setDataRowsCondition, setModalConditionState } = useTaskTypeContext();

  const methods = useFormContext();

  const { append } = useFieldArray({
    control: methods.control,
    name: 'condition_list',
  });
  const conditionList = methods.watch('condition_list');

  const [loading, setLoading] = useState(false);
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({
    data: dataRowsCondition.filter(item => !conditionList?.find(i => i.condition_id === item.condition_id)),
  });

  const loadData = useCallback(() => {
    setLoading(true);
    TaskTypeService.getListCondition(params)
      .then(setDataRowsCondition)
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    setModalConditionState((prev) => ({ ...prev, refreshCondition: loadData }));
    loadData();
  }, [loadData]);


  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Tên điều kiện',
        formatter: (p, index) => {
          if (!p?.is_database) {
            return p?.condition_name;
          }
          return (
            <div className='bw_flex bw_justify_content_between bw_align_items_center'>
              <div>{p?.condition_name}</div>
              <div><DatabaseTwoTone />{' '}Theo dữ liệu</div>
            </div>
          );
        },
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-arrow-alt-right',
        type: 'success',
        content: 'Thêm địa chỉ',
        permission: PERMISSION.ADD_CONDITION,
        onClick: (p, index) => {
          append(p);
          setDataRowsCondition((prev) => {
            const _prev = [...prev];
            _prev.splice(index, 1);
            return _prev;
          });
        },
      },
    ];
  }, []);

  return (
    <DataTable
      noSelect={true}
      columns={columns}
      data={rows}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
    />
  );
}

export default TableSelectCondition;
