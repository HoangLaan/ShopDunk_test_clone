import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
// Services
import { deleteGroupService } from '../helpers/call-api';

const GroupServiceTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Mã nhóm dịch vụ',
        accessor: 'group_service_code',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          let name = p?.group_service_code;
          return (
            <Tooltip title={name}>
              <b>{name.length > 20 ? `${name?.slice(0, 20)}...` : name}</b>
            </Tooltip>
          );
        },
      },
      {
        header: 'Tên nhóm dịch vụ',
        accessor: 'group_service_name',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          let name = p?.group_service_name;
          return (
            <Tooltip title={name}>
              <b>{name.length > 20 ? `${name?.slice(0, 20)}...` : name}</b>
            </Tooltip>
          );
        },
      },
      {
        header: 'Nhóm dịch vụ cha',
        accessor: 'parent_group_service_name',
        // classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Hiển thị web',
        accessor: 'is_show_web',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          let status = p?.is_show_web;
          return (
            <Tooltip title={status}>
              {status === 1 ? "Hiển thị" : "Ẩn"}
            </Tooltip>
          );
        },
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        // formatter: (p) => {
        //   let status = p?.is_active;
        //   return (
        //     <Tooltip title={status}>
        //       {status === 1 ? "Kích hoạt" : "Ẩn"}
        //     </Tooltip>
        //   );
        // },
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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
        permission: 'MD_GROUPSERVICE_ADD',
        onClick: () => window._$g.rdr(`/group-service/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_GROUPSERVICE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/group-service/edit/${p?.group_service_code}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_GROUPSERVICE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/group-service/detail/${p?.group_service_code}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_GROUPSERVICE_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(`${p?.group_service_code}`),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    await deleteGroupService({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.group_service_code)?.join(',');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
          // (items || []).forEach((item) => {
          //   handleDelete(item.solution_id);
          // });
        }),
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

export default GroupServiceTable;
