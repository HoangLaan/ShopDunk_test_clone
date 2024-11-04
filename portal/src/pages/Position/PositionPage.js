import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PositionFilter from './components/table/PositionFilter';
import { getPositions } from './actions/position';
import { useDispatch, useSelector } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import { deletePosition } from 'services/position.service';

const PositionPage = () => {
  const dispatch = useDispatch();

  const { positionList, getPositionsLoading } = useSelector((state) => state.position);
  const { items, itemsPerPage, page, totalItems, totalPages } = positionList;
  const [params, setParams] = useState({});

  const loadPosition = useCallback(() => {
    dispatch(getPositions(params));
  }, [params]);
  useEffect(loadPosition, [loadPosition]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên vị trí',
        accessor: 'position_name',
        formatter: (p) => <b>{p?.position_name}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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
        permission: 'MD_POSITION_ADD',
        onClick: () => window._$g.rdr(`/position/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_POSITION_EDIT',
        onClick: (p) => window._$g.rdr(`/position/edit/${p?.position_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_POSITION_VIEW',
        onClick: (p) => window._$g.rdr(`/position/detail/${p?.position_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_POSITION_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePosition([_?.position_id]);
                loadPosition();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PositionFilter onChange={setParams} />
        <DataTable
          loading={getPositionsLoading}
          columns={columns}
          data={items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleBulkAction={(e) =>
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  await deletePosition(e?.map((o) => o?.position_id));
                  loadPosition();
                },
              ),
            )
          }
        />
      </div>
    </React.Fragment>
  );
};

export default PositionPage;
