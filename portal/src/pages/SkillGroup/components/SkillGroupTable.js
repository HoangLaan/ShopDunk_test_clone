import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteSkillGroup } from '../helpers/call-api';
import Truncate from 'components/shared/Truncate';

const SkillGroupTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
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
        header: 'Tên nhóm kỹ năng',
        accessor: 'skillgroup_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
        formatter: (d) => <Truncate>{d.description}</Truncate>,
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_SKILLGROUP_ADD',
        onClick: () => window._$g.rdr(`/skill-group/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_SKILLGROUP_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/skill-group/edit/${p?.skillgroup_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_SKILLGROUP_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/skill-group/detail/${p?.skillgroup_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_SKILLGROUP_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.skillgroup_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteSkillGroup(params);
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

export default SkillGroupTable;
