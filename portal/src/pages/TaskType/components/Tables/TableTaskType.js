import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import { PERMISSION } from 'pages/TaskType/utils/constants';
import TaskTypeService from 'services/task-type.service';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';
import ModalImport from '../Modals/ModalImport';
import { createDownloadFile } from 'pages/TaskType/utils/utils';

const COLUMN_ID = 'task_type_id';

const TableTaskType = ({ params, onChangePage }) => {
  const dispatch = useDispatch();
  const { isOpenModalImport, openModalImport, setImportState } = useTaskTypeContext();

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
    TaskTypeService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
    setImportState((prev) => ({ ...prev, refreshTaskType: loadData }));
  }, [loadData]);

  const exportExcel = () => {
    TaskTypeService.exportExcel(params)
      .then((response) => createDownloadFile(response?.data, 'task-type.xlsx'))
      .catch(() => {});
  };

  const columns = useMemo(
    () => [
      {
        header: 'Tên loại công việc',
        classNameHeader: 'bw_text_center',
        accessor: 'type_name',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success bw_text_center', {
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
        onClick: () => window._$g.rdr('/task-type/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/task-type/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/task-type/detail/${p?.[COLUMN_ID]}`),
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
                await TaskTypeService.delete([p?.[COLUMN_ID]]);
                loadData();
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
                await TaskTypeService.delete(e?.map((o) => o?.[COLUMN_ID]));
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

export default TableTaskType;
