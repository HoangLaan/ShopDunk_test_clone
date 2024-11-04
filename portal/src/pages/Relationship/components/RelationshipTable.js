import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteRelationship } from '../helpers/call-api';
import { splitString } from 'utils';
import RelationshipService from 'services/relationship.service';

const COLUMN_ID = 'relationshipmember_id';

const LevelTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'relationshipmember_id',
        // formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên mối quan hệ',
        accessor: 'relationship_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'decription',
        // formatter: (d) => splitString(d.description, 70),
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_system',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_system ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Hệ thống</span>
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_RELATIONSHIP_ADD',
        onClick: () => window._$g.rdr(`/relationship/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_RELATIONSHIP_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/relationship/edit/${p?.relationshipmember_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_RELATIONSHIP_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/relationship/detail/${p?.relationshipmember_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_RELATIONSHIP_DEL',
        onClick: (d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await RelationshipService.deleteByID([d?.[COLUMN_ID]]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteRelationship(params);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items),
        ),
      );
    }
  };

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
      handleBulkAction={handleBulkAction}
    />
  );
};

export default LevelTable;
