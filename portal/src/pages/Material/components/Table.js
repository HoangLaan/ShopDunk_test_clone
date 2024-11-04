import React, { useMemo } from 'react';

import DataTable from 'components/shared/DataTable/index';
import BWImage from 'components/shared/BWImage/index';
import HomeIcon from 'assets/bw_image/icon/i__cus_home.svg';
import CheckAccess from 'navigation/CheckAccess';

const Table = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
  exportExcel,
  importExcel,
  loading,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Mã túi bao bì',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <CheckAccess permission={'MD_MATERIAL_EDIT'}>
            <b
              style={{ cursor: 'pointer' }}
              onClick={() => handleActionRow(p, 'edit')}
              className='bw_sticky bw_name_sticky'>
              {p?.material_code}
            </b>
          </CheckAccess>
        ),
      },
      {
        header: 'Tên túi bao bì',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p.picture_url} />
            {p?.material_name}
          </div>
        ),
      },
      {
        header: 'Nhóm túi bao bì',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.material_group_name}</b>,
      },
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.manufacturer_name}</b>,
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.created_date}</b>,
      },
      {
        header: 'Trạng thái',
        accessor: 'status',
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

  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-out',
      type: 'success',
      content: 'Export',
      outline: true,
      onClick: () => exportExcel(),
      permission: 'MD_MATERIAL_VIEW',
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-in',
      type: 'success',
      outline: true,
      content: 'Import',
      onClick: () => importExcel(),
      permission: 'MD_MATERIAL_ADD',
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-add',
      type: 'success',
      content: 'Thêm mới',
      onClick: () => window._$g.rdr('/material/add'),
      permission: 'MD_MATERIAL_ADD',
    },
    {
      icon: 'fi fi-rr-copy-alt',
      color: 'ogrance',
      onClick: (p) => handleActionRow(p, 'copy'),
      permission: 'MD_MATERIAL_ADD',
    },
    {
      icon: 'fi fi-rr-edit',
      color: 'blue',
      onClick: (p) => handleActionRow(p, 'edit'),
      permission: 'MD_MATERIAL_EDIT',
    },
    {
      icon: 'fi fi-rr-eye',
      color: 'green',
      onClick: (p) => handleActionRow(p, 'detail'),
      permission: 'MD_MATERIAL_VIEW',
    },
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      onClick: (p) => handleActionRow(p, 'delete'),
      permission: 'MD_MATERIAL_DEL',
    },
  ];

  const title = (
    <div className='bw_count_cus'>
      <BWImage src={HomeIcon} />
      Tổng: {totalItems}
    </div>
  );

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
      title={title}
      loading={loading}
    />
  );
};

export default Table;
