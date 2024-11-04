import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { useFormContext } from 'react-hook-form';
import { formatQuantity } from 'utils/number';
import ProductsModalFilter from './ProductsModalFilter';
import { getProductsOfPurchaseOrders } from 'services/return-purchase.service';

function ProductsModal({ defaultDataSelect = [], open, onClose, onApply, title }) {
  const [productsSelected, setProductsSelected] = useState([]);
  const methods = useFormContext();
  const { watch } = methods;
  const defaultParams = {
    is_active: 1,
    page: 1,
    itemsPerPage: 6,
    purchase_order_id: watch('purchase_order_id'),
    stocks_id: watch('stocks_id'),
  };
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getProducts = useCallback(() => {
    setLoading(true);
    getProductsOfPurchaseOrders(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(getProducts, [getProducts]);

  const columns = [
    {
      header: 'Ngày tạo',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'created_date',
    },
    {
      header: 'Mã đơn mua hàng',
      classNameHeader: 'bw_text_center',
      accessor: 'purchase_order_code',
    },
    {
      header: 'Mã sản phẩm',
      classNameHeader: 'bw_text_center',
      accessor: 'product_code',
    },
    {
      header: 'Tên sản phẩm',
      classNameHeader: 'bw_text_center',
      accessor: 'product_name',
    },
    {
      header: 'IMEI',
      classNameHeader: 'bw_text_center',
      accessor: 'imei',
    },
    {
      header: 'Đơn giá',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      accessor: 'cost_price',
      formatter: (value) => formatQuantity(value.cost_price),
    },
    {
      header: 'Thành tiền',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (value) => formatQuantity(value.cost_price),
    },
  ];

  return (
    <Modal
      witdh={'60%'}
      open={open}
      onClose={onClose}
      header={title}
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(productsSelected);
            onClose();
          }}
        />
      }>
      <ProductsModalFilter
        onReset={(value) => setParams({ ...defaultParams, ...value })}
        onChange={(e) => {
          setParams((prev) => {
            return {
              ...prev,
              ...e,
            };
          });
        }}
      />
      <DataTable
        fieldCheck={'imei'}
        defaultDataSelect={defaultDataSelect}
        loading={loading}
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
        onChangeSelect={(d) => {
          setProductsSelected(d);
        }}
      />
    </Modal>
  );
}

export default ProductsModal;
