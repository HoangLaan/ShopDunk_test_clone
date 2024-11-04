import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const TextEllipsis = ({ suffixCount, children }) => {
  if (!children) return '';
  const start = children.slice(0, suffixCount).trim();
  return (
    <Text
      style={{
        maxWidth: '100%',
      }}
      ellipsis={{
        suffix: '...',
      }}>
      {start}
    </Text>
  );
};

const Table = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Tên nhóm người dùng',
        accessor: 'user_group_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.user_group_name}</b>,
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.company_name}</span>,
      },
      {
        header: 'Miền áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.business_name}</span>,
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.created_date}</span>,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TextEllipsis suffixCount={50}>{p?.description}</TextEllipsis>,
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
            <span className='bw_label_outline bw_label_outline_danger text-center'>Khóa</span>
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
        permission: 'SYS_USERGROUP_ADD',
        onClick: () => window._$g.rdr('/user-group/add'),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SYS_USERGROUP_VIEW',
        onClick: (p) => handleActionRow(p, 'detail'),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SYS_USERGROUP_EDIT',
        onClick: (p) => handleActionRow(p, 'edit'),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SYS_USERGROUP_DEL',
        onClick: (p) => handleActionRow(p, 'delete'),
      },
    ];
  }, []);

  return (
    <DataTable
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

export default Table;
