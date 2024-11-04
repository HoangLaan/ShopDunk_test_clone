import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import pick from 'lodash/pick';

function SelectProductModalTable({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onClose,
}) {
  const methods = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'Mã khuyến mãi',
        accessor: 'promotion_id',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên chương trình khuyến mãi',
        accessor: 'promotion_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày bắt đầu',
        accessor: 'begin_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày kết thúc',
        accessor: 'end_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
        p?.is_active ? (
          <span class='text-center'>Kích hoạt</span>
        ) : (
          <span class='text-center'>Ẩn</span>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        let oldDataSelect = methods.watch('promotion_list');
        if (oldDataSelect?.length > 0) {
          //get element from oldDataSelect in dataSelect
          oldDataSelect = dataSelect.filter((e) => !oldDataSelect.find((x) => x?.promotion_id === e?.promotion_id));

          //merge oldDataSelect and dataSelect by promotion_id
          dataSelect = dataSelect.map((e) => {
            const oldData = oldDataSelect.find((x) => x?.promotion_id === e?.promotion_id);
            return {
              ...e,
              ...oldData,
            };
          });
        }

        const list = dataSelect?.map((item, idx) =>
          pick(item, [
            'promotion_id',
            'promotion_name',
            'begin_date',
            'end_date',
          ]),
        );

        methods.setValue('promotion_list', list);
      }}
      fieldCheck='promotion_id'
      defaultDataSelect={methods.watch('promotion_list')}
      hiddenDeleteClick
    />
  );
}

export default SelectProductModalTable;
