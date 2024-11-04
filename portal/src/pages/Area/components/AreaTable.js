import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteArea, deleteListArea } from 'services/area.service';
import PropTypes from 'prop-types';
import Truncate from 'components/shared/Truncate';

const AreaTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên khu vực',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d) => <b>{d.area_name}</b>,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (d) => <Truncate>{d.description}</Truncate>,
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
        onClick: () => window._$g.rdr(`/area/add`),
        permission: 'MD_AREA_ADD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => {
          window._$g.rdr(`/area/edit/${p?.area_id}`);
        },
        permission: 'MD_AREA_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => window._$g.rdr(`/area/detail/${p?.area_id}`),
        permission: 'MD_AREA_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        permission: 'MD_AREA_DEL',
        color: 'red',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteArea(p?.area_id);
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
              await deleteListArea(e.map((o) => o.area_id));

              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

AreaTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  totalPages: PropTypes.number,
  itemsPerPage: PropTypes.number,
  page: PropTypes.number,
  totalItems: PropTypes.number,
  onChangePage: PropTypes.func,
  onRefresh: PropTypes.func,
};

AreaTable.defaultProps = {
  loading: false,
  data: [],
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 0,
  onChangePage: () => {},
  onRefresh: () => {},
};

export default AreaTable;
