import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { deleteBusinessType, deleteListBusinessType } from '../../../services/business-type.service';
import { useAuth } from '../../../context/AuthProvider';
import Truncate from 'components/shared/Truncate';

const COLUMN_ID = 'business_type_id';

const BusinessTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên loại miền',
        accessor: 'business_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (d) => <Truncate>{d.descriptions}</Truncate>,
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
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
        permission: 'AM_BUSINESSTYPE_ADD',
        onClick: () => window._$g.rdr('/business-type/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'AM_BUSINESSTYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/business-type/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'AM_BUSINESSTYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/business-type/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'AM_BUSINESSTYPE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                deleteBusinessType([p?.[COLUMN_ID]]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={async (e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                document.getElementById('data-table-select')?.click();
                deleteListBusinessType(e?.map((o) => o?.[COLUMN_ID]));
                onRefresh();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default BusinessTypeTable;
