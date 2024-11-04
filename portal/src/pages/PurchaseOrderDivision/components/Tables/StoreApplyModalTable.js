import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable';
import { getList } from 'services/store.service';
import { showToast } from 'utils/helpers';

const StoreApplyModalTable = ({ params, onChange, defaultDataSelect, setModalDataSelect }) => {
  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });
  const [tableKey, setTableKey] = useState(0);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(loadData, [loadData]);

  const columns = useMemo(() => {
    return [
      {
        header: 'Tên cửa hàng',
        accessor: 'store_name',
      },
      {
        header: 'Khu vực',
        accessor: 'area_name',
      },
      {
        header: 'Địa chỉ',
        accessor: 'area_name',
      },
    ];
  }, []);

  const actions = [
    {
      globalAction: true,
      icon: 'fa fa-street-view',
      type: 'success',
      outline: true,
      content: 'Chọn tất cả',
      onClick: async () => {
        try {
          const res = await getList({ ...params, page: 1, itemsPerPage: 17520886 });
          setModalDataSelect(res?.items || [])
          setTableKey(prev => ++prev)
        } catch (error) {
          showToast.error('Lấy danh sách cửa hàng xảy ra lỗi');
        }
      },
    },
  ];

  return (
    <DataTable
      key={tableKey}
      hiddenActionRow={true}
      hiddenDeleteClick={true}
      actions={actions}
      fieldCheck='store_id'
      defaultDataSelect={defaultDataSelect}
      loading={dataRows.loading}
      columns={columns}
      data={dataRows.items}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={(page) => onChange({ page })}
      onChangeSelect={(newDataSelect) => setModalDataSelect(newDataSelect)}
    />
  );
};

export default StoreApplyModalTable;
