import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';

import interestContentService from 'services/interestContent.service';
import { INTEREST_CONTENT_PERMISSION } from 'pages/InterestContent/utils/constants';
import StatusColumn from '../StatusColumn/StatusColumn';

const COLUMN_ID = 'interest_content_id';

const InterestContentTable = ({ params, onChangePage }) => {
  const dispatch = useDispatch();

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
    interestContentService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Nội dung quan tâm',
        formatter: (p) => <b>{p?.interest_content_name}</b>,
      },
      {
        header: 'Mô tả',
        accessor: 'description',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <StatusColumn status={p?.is_active} />,
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: INTEREST_CONTENT_PERMISSION.ADD,
        onClick: () => window._$g.rdr('/interest-content/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: INTEREST_CONTENT_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/interest-content/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: INTEREST_CONTENT_PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await interestContentService.delete([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      fieldCheck={COLUMN_ID}
      loading={dataRows.loading}
      columns={columns}
      data={dataRows.items}
      actions={actions}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={onChangePage}
      handleBulkAction={async (e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await interestContentService.delete(e?.map((o) => o?.[COLUMN_ID]));
              loadData();
            },
          ),
        );
      }}
    />
  );
};

export default InterestContentTable;
