import React, {Fragment, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import {showConfirmModal} from 'actions/global';
import {deleteListMaterialGr, deleteMaterialGrByID} from "../../../../services/material-group.service";

const COLUMN_ID = 'material_group_id';

const MaterialGroupTable = ({loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên nhóm nguyên liệu',
        accessor: 'material_group_name'
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
      }
      ,
      {
        header: 'Kích hoạt',
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
        permission: "MTR_MATERIALGROUP_ADD",
        onClick: () => window._$g.rdr('/material-group/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: "MTR_MATERIALGROUP_EDIT",
        onClick: (p) => window._$g.rdr(`/material-group/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: "MTR_MATERIALGROUP_VIEW",
        onClick: (p) => window._$g.rdr(`/material-group/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: "MTR_MATERIALGROUP_DEL",
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteMaterialGrByID([p?.[COLUMN_ID]]);
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
                await deleteListMaterialGr(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click()
                onRefresh();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default MaterialGroupTable;
