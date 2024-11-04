import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';

import BankUserService from 'services/bank-user.service';
import ModalImport from '../Modals/ModalImport';
import { PERMISSION } from 'pages/BankUser/utils/constants';
import { useBankUserContext } from 'pages/BankUser/utils/context';
import { createDownloadFile } from 'pages/BankUser/utils/utils';

const COLUMN_ID = 'bank_user_id';

const TableBankUser = ({ params, onChangePage }) => {
  const dispatch = useDispatch();
  const { isOpenModalImport, openModalImport, setImportState } = useBankUserContext();

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
    if (params?.search) {
      params.search = params.search.trim();
    }
    BankUserService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
    setImportState((prev) => ({ ...prev, refreshAfterImport: loadData }));
  }, [loadData]);

  const exportExcel = useCallback(() => {
    if (dataRows.totalItems <= 0) {
      showToast.warning('Hiện tại không có dữ liệu để xuất excel');
      return;
    }
    BankUserService.exportExcel(params)
      .then((response) => createDownloadFile(response?.data, 'bank-user.xlsx'))
      .catch(() => {});
  }, [params, dataRows.totalItems]);

  const columns = useMemo(
    () => [
      {
        header: 'Số tài khoản',
        accessor: 'bank_number',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên ngân hàng',
        accessor: 'bank_name',
        classNameHeader: 'bw_text_center',
      },
      // {
      //   header: 'Công ty áp dụng',
      //   accessor: 'company_name',
      // },
      {
        header: 'Chủ tài khoản',
        accessor: 'bank_username',
        classNameHeader: 'bw_text_center',
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
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline text-center', {
              bw_label_outline_success: p?.is_active,
              bw_label_outline_danger: !p?.is_active,
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
        icon: ICON_COMMON.import,
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Xuất excel',
        permission: PERMISSION.IMPORT,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.export,
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Nhập excel',
        permission: PERMISSION.EXPORT,
        onClick: () => openModalImport(true),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr('/bank-user/add'),
      },
      {
        icon: ICON_COMMON.edit,
        title: 'Sửa',
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/bank-user/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        title: 'Chi tiết',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/bank-user/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        title: 'Xóa',
        permission: PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await BankUserService.delete([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
    ];
  }, [exportExcel]);

  return (
    <Fragment>
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
                await BankUserService.delete(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click();
                loadData();
              },
            ),
          );
        }}
      />
      {isOpenModalImport && <ModalImport />}
    </Fragment>
  );
};

export default TableBankUser;
