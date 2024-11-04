import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import { PERMISSION } from 'pages/Experience/utils/constants';
import returnConditionService from 'services/return-condition.service';

const RETURNCONDITION_ID = 'returnCondition_id';

const ReturnConditionType = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const [applyPolicy, setApplyPolicy] = useState('');
  useEffect(() => {
    if (data.is_return == 'true') {
      setApplyPolicy('Trả hàng');
      console.log(applyPolicy);
    }
    if (data.is_exchange == 'true') {
      setApplyPolicy('Đổi hàng');
    }
  }, [applyPolicy, data]);

  const columns = useMemo(
    () => [
      {
        header: 'Số thứ tự',
        classNameHeader: 'bw_text_center',
        accessor: 'returnCondition_id',
      },
      {
        header: 'Điều kiện',
        classNameHeader: 'bw_text_center',
        accessor: 'returnCondition_name',
      },
      {
        header: 'Áp dụng cho chính sách',
        classNameHeader: 'bw_text_center',
        accessor: 'is_option',
        formatter: (p) => (
          <span>
            {p?.is_return && p?.is_exchange
              ? 'Trả hàng,Đổi hàng'
              : p?.is_return
              ? 'Trả hàng'
              : p?.is_exchange
              ? 'Đổi hàng'
              : ''}
          </span>
        ),
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr('/return-condition/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/return-condition/edit/${p?.[RETURNCONDITION_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/return-condition/detail/${p?.[RETURNCONDITION_ID]}`),
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
                await returnConditionService.deleteByID([p?.[RETURNCONDITION_ID]]);
                onRefresh();
                console.log('Success delete');
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        fieldCheck={RETURNCONDITION_ID}
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
                await returnConditionService.deleteListExperience(e?.map((o) => o?.[RETURNCONDITION_ID]));
                document.getElementById('data-table-select')?.click();
                onRefresh();
              },
            ),
          );
        }}
      />
    </Fragment>
  );
};

export default ReturnConditionType;
