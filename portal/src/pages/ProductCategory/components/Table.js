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
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1,
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p.picture_url} />
            {(
              <CheckAccess permission='MD_PRODUCTCATEGORY_EDIT'>
                <a
                  href='/'
                  onClick={(e) => {
                    e.preventDefault();
                    window._$g.rdr('/product-category/edit/' + p.product_category_id);
                  }}>
                  <b>{p.category_name}</b>
                </a>
              </CheckAccess>
            ) || (
                <CheckAccess permission='MD_PRODUCTCATEGORY_VIEW'>
                  <a
                    href='/'
                    onClick={(e) => {
                      e.preventDefault();
                      window._$g.rdr('/product-category/detail/' + p.product_category_id);
                    }}>
                    <b>{p.category_name}</b>
                  </a>
                </CheckAccess>
              ) || <b>{p.category_name}</b>}
          </div>
        ),
      },
      {
        header: 'Thuộc ngành hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          const parentList = `${p?.parent_name}`.split('|');
          if (!parentList.length || parentList.length == 1) return <b>--</b>;
          // Remove last item
          parentList.pop();
          let parentName = parentList.map((x, i) => (i < parentList.length - 1 ? ' -- ' : x)).join(' ');
          return <b>{`|-- ${parentName}`}</b>;
        },
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.company_name}</b>,
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date_view',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p.created_user_avatar} />
            {p?.created_user}
          </div>
        ),
      },

      {
        header: 'Hiển thị Web',
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

  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-out mr-2',
      className: 'bw_btn_outline_success',
      type: 'success',
      outline: true,
      permission: 'MD_PRODUCTCATEGORY_VIEW',
      content: 'Xuất excel',
      onClick: () => exportExcel(),
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-add',
      type: 'success',
      content: 'Thêm mới',
      permission: 'MD_PRODUCTCATEGORY_ADD',
      onClick: () => window._$g.rdr('/product-category/add'),
    },
    {
      icon: 'fi fi-rr-edit',
      color: 'blue',
      permission: 'MD_PRODUCTCATEGORY_EDIT',
      onClick: (p) => handleActionRow(p, 'edit'),
    },
    {
      icon: 'fi fi-rr-eye',
      color: 'green',
      permission: 'MD_PRODUCTCATEGORY_VIEW',
      onClick: (p) => handleActionRow(p, 'detail'),
    },
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      permission: 'MD_PRODUCTCATEGORY_DEL',
      onClick: (p) => handleActionRow(p, 'delete'),
    },
  ];

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
