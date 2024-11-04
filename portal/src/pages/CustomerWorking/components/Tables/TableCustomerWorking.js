import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import { PERMISSION } from 'pages/CustomerLead/utils/constants';
import CustomerWorkingService from 'services/customer-working.service';
import CareActions from '../CareActions/CareActions';

const COLUMN_ID = 'task_detail_id';

const TableCustomerWorking = ({ params, onChange }) => {
  const dispatch = useDispatch();

  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const onChangePage = (page) => onChange({ page });
  const onChangeStatus = (task_status) => onChange({ task_status });

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    CustomerWorkingService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã Walk in',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.task_detail_id ?? 'Chưa cập nhật'}</b>,
      },
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.data_leads_code ?? 'Chưa cập nhật'}</b>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.store_name}</b>,
      },
      {
        header: 'Tên khách hàng Walk in',
        classNameHeader: 'bw_text_center',
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        accessor: 'gender',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'create_date',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'create_user',
      },
      {
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success text-center', {
              success: p?.is_active,
              danger: !p?.is_active,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
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
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/customer-working/add`),
      },
    ];
  }, []);

  const actionsTable = useMemo(() => {
    return [
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/customer-working/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/customer-working/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await CustomerWorkingService.deleteTaskWorking([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <CareActions params={params} actions={actions} onChangeStatus={onChangeStatus} totalItems={dataRows.totalItems} />
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        actions={actionsTable}
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
                await CustomerWorkingService.deleteTaskWorking(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click();
                loadData();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default TableCustomerWorking;
