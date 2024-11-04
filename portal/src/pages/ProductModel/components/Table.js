import BWImage from 'components/shared/BWImage/index';
import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';
import React, { useMemo } from 'react';

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
  query,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Mã model sản phẩm',
        accessor: 'mode_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p?.picture_url} />
            {(
              <CheckAccess permission='MD_PRODUCTMODEL_EDIT'>
                <a
                  href='/'
                  onClick={(e) => {
                    e.preventDefault();
                    window._$g.rdr('/product-model/edit/' + p.model_id);
                  }}>
                  <b>{p.model_code}</b>
                </a>
              </CheckAccess>
            ) || (
                <CheckAccess permission='MD_PRODUCTMODEL_VIEW'>
                  <a
                    href='/'
                    onClick={(e) => {
                      e.preventDefault();
                      window._$g.rdr('/product-model/detail/' + p.model_id);
                    }}>
                    <b>{p.model_code}</b>
                  </a>
                </CheckAccess>
              ) || <b>{p.model_code}</b>}
          </div>
        ),
      },
      {
        header: 'Tên model sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.model_name}</b>,
      },
      {
        header: 'Tên model hiển thị',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.display_name}</b>,
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>|--{p?.category_name}</b>,
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
        icon: 'fi fi-rr-inbox-out mr-2',
        className: 'bw_btn_outline_success',
        type: 'success',
        outline: true,
        content: 'Xuất excel',
        onClick: () => exportExcel(),
        permission: 'MD_PRODUCTMODEL_VIEW',
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        onClick: () => window._$g.rdr('/product-model/add'),
        permission: 'MD_PRODUCTMODEL_ADD',
      },
      {
        icon: 'fi fi-rr-copy-alt',
        color: 'ogrance',
        onClick: (p) => handleActionRow(p, 'copy'),
        permission: 'MD_PRODUCTMODEL_ADD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => handleActionRow(p, 'edit'),
        permission: 'MD_PRODUCTMODEL_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => handleActionRow(p, 'detail'),
        permission: 'MD_PRODUCTMODEL_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (p) => handleActionRow(p, 'delete'),
        permission: 'MD_PRODUCTMODEL_DEL',
      },
    ];
  }, [handleActionRow, exportExcel]);

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
