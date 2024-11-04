import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { getListProduct } from 'services/return-policy.service';
import AWProductFilter from './AWProductFilter';

function AWProductModal({ open, onClose, defaultDataSelect, onApply, listCategory }) {
  const categoryIds = useMemo(() => listCategory.map((c) => c.product_category_id ?? c.category_id), [listCategory]);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
    category_ids: categoryIds,
  });
  const [listProduct, setListProduct] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [productSelected, setProductSelected] = useState([]);

  const loadListProduct = useCallback(() => {
    setLoading(true);
    getListProduct(params)
      .then(setListProduct)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listProduct;

  useEffect(() => loadListProduct(), [loadListProduct]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  return (
    <Modal
      witdh={'55%'}
      open={open}
      onClose={onClose}
      header='Danh sách sản phẩm'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(productSelected);
            onClose();
          }}
        />
      }>
      <AWProductFilter
        listCategory={listCategory}
        onChange={(e) => {
          setParams((prev) => {
            return {
              ...prev,
              ...e,
              category_ids: e.category_ids_filter ? [e.category_ids_filter] : categoryIds,
            };
          });
        }}
      />
      <DataTable
        hiddenDeleteClick
        defaultDataSelect={defaultDataSelect}
        loading={loading}
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangeSelect={(d) => {
          setProductSelected(d);
        }}
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
      />
    </Modal>
  );
}

export default AWProductModal;
