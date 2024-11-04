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
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p?.picture_url} />
            {/* {(
              <CheckAccess permission='MD_PRODUCT_EDIT'>
                <a
                  href='/'
                  onClick={(e) => {
                    e.preventDefault();
                    window._$g.rdr('/product/edit/' + p.product_id);
                  }}>
                  <b>{p.product_code}</b>
                </a>
              </CheckAccess>
            ) || (
                // <CheckAccess permission='MD_PRODUCT_VIEW'>
                <a
                  href='/'
                  onClick={(e) => {
                    e.preventDefault();
                    window._$g.rdr('/product/detail/' + p.product_id);
                  }}>
                  <b>{p.product_code}</b>
                </a>
                // </CheckAccess>
              ) ||  */}
            <b>{p.product_code}</b>
          </div>
        ),
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p.picture_url} />
            {p?.product_name}
          </div>
        ),
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.category_name}</b>,
      },
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.manufacture_name}</b>,
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.created_date}</b>,
      },
      {
        header: 'Hiển thị web',
        accessor: 'is_show_web',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_show_web ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Hiện</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
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
      permission: 'MD_PRODUCT_VIEW',
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-in',
      type: 'success',
      outline: true,
      content: 'Import',
      onClick: () => importExcel(),
      permission: 'MD_PRODUCT_ADD',
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-rectangle-barcode',
      outline: true,
      type: 'none',
      content: 'In mã vạch',
      onClick: () => window._$g.rdr('/product/barcode'),
      permission: 'MD_PRODUCT_VIEW',
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-add',
      type: 'success',
      content: 'Thêm mới',
      onClick: () => window._$g.rdr('/product/add'),
      permission: 'MD_PRODUCT_ADD',
    },
    {
      icon: 'fi fi-rr-copy-alt',
      color: 'ogrance',
      onClick: (p) => handleActionRow(p, 'copy'),
      permission: 'MD_PRODUCT_ADD',
    },
    {
      icon: 'fi fi-rr-edit',
      color: 'blue',
      onClick: (p) => handleActionRow(p, 'edit'),
      permission: 'MD_PRODUCT_EDIT',
    },
    {
      icon: 'fi fi-rr-eye',
      color: 'green',
      onClick: (p) => handleActionRow(p, 'detail'),
      permission: 'MD_PRODUCT_VIEW',
    },
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      onClick: (p) => handleActionRow(p, 'delete'),
      permission: 'MD_PRODUCT_DEL',
    },
  ];

  const title = (
    <div className='bw_count_cus'>
      <BWImage src={HomeIcon} />
      Tổng số sản phẩm: {totalItems}
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
    />
  );
};

export default Table;
