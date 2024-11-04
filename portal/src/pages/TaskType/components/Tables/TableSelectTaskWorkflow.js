import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import TaskTypeService from 'services/task-type.service';

const TableSelectTaskWorkflow = ({ params, onChangePage }) => {
  const { watch, setValue } = useFormContext();
  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    TaskTypeService.getTaskWorkFlow(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên bước xử lý công việc',
        accessor: 'work_flow_name',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
      },
      {
        header: 'Đồng ý mua?',
        formatter: (p, index) => (p.type_purchase ? 'Có' : 'Không'),
      },
    ],
    [],
  );

  const handleBulkAction = (values, options) => {
    setValue('task_wflow_list', values);
  };

  return (
    <DataTable
      fieldCheck='task_work_flow_id'
      defaultDataSelect={watch('task_wflow_list')}
      hiddenDeleteClick={true}
      loading={dataRows.loading}
      columns={columns}
      data={dataRows.items}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default TableSelectTaskWorkflow;
