import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteProductAttribute } from 'services/product-attribute.service';
import DataTable from 'components/shared/DataTable/index';

const ProductAttributeTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên thuộc tính',
        accessor: 'attribute_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Loại thuộc tính',
        classNameHeader: 'bw_text_center',
        accessor: 'attribute_type',
      },
      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',
        accessor: 'unit_name',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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

  const handleDelete = useCallback(
    async (id) => {
      await deleteProductAttribute(id);
      onRefresh();
    },
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'PRO_PRODUCTATTRIBUTE_ADD',
        onClick: () => window._$g.rdr(`/product-attribute/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'PRO_PRODUCTATTRIBUTE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/product-attribute/edit/${p?.product_attribute_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'PRO_PRODUCTATTRIBUTE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/product-attribute/detail/${p?.product_attribute_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'PRO_PRODUCTATTRIBUTE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.product_attribute_id),
            ),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          (items || []).forEach((item) => {
            handleDelete(item.product_attribute_id);
          });
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

export default ProductAttributeTable;
