import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deletePositionLevel } from 'services/position-level.service';
import PropTypes from 'prop-types';
import { splitString } from 'utils';

const PositionLevelTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên cấp bậc nhân viên',
        classNameHeader: 'bw_text_center',
        formatter: (d) => <b>{d.position_level_name}</b>,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (d) => splitString(d.description, 70),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
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
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        onClick: () => window._$g.rdr(`/position-level/add`),
        permission: 'MD_POSITIONLEVEL_ADD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => {
          window._$g.rdr(`/position-level/edit/${p?.position_level_id}`);
        },
        permission: 'MD_POSITIONLEVEL_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => window._$g.rdr(`/position-level/detail/${p?.position_level_id}`),
        permission: 'MD_POSITIONLEVEL_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        permission: 'MD_POSITIONLEVEL_DEL',
        color: 'red',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePositionLevel([p?.position_level_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deletePositionLevel(e.map((o) => o.position_level_id));

              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

PositionLevelTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  totalPages: PropTypes.number,
  itemsPerPage: PropTypes.number,
  page: PropTypes.number,
  totalItems: PropTypes.number,
  onChangePage: PropTypes.func,
  onRefresh: PropTypes.func,
};

PositionLevelTable.defaultProps = {
  loading: false,
  data: [],
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 0,
  onChangePage: () => {},
  onRefresh: () => {},
};

export default PositionLevelTable;