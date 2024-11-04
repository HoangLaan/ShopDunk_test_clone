import React, { useCallback, useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import { deleteItem, getListProduct } from 'pages/Prices/helpers/call-api';
import PricesListTable from 'pages/Prices/components/table-price-list/PricesListTable';
import PricesListFilter from 'pages/Prices/components/table-price-list/PricesListFilter';
import { checkProductType } from '../components/contain/contain';

const PricesList = () => {
  const [params, setParams] = useState({
    page: 1,
    product_type_id: checkProductType['2'],
    itemsPerPage: 25,
    is_active: 1,
  });
  const [dataPricesPage, setDataPricesPage] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    product_type_id: checkProductType['2'],
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [productTypeId, setProductTypeId] = useState(checkProductType['2']);
  const [dataSelectOut, setDataSelectOut] = useState([]);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataPricesPage;

  const loadPricesPage = useCallback(() => {
    let cloneParam = structuredClone(params);
    cloneParam.product_type_id = productTypeId;
    setLoading(true);
    getListProduct(cloneParam)
      .then(setDataPricesPage)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadPricesPage();
    return () => {};
  }, [loadPricesPage]);

  const handleDelete = async (price_review_level_id) => {
    // Lấy ra vị trí
    deleteItem({ price_review_level_id: price_review_level_id })
      .then(() => {
        loadPricesPage();

        showToast.success(`Xoá thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .catch((error) => {
        if (error.message) {
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }
      });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PricesListFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
              page: 1,
            });
          }}
        />
        <PricesListTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChangeListPage={(product_type_id, page) => {
            setParams({
              ...params,
              product_type_id,
              page,
            });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          loading={loading}
          totalItems={totalItems}
          hiddenDeleteClick={true}
          setDataSelectOut={setDataSelectOut}
          dataSelectOut={dataSelectOut}
          setProductTypeId={setProductTypeId}
        />
      </div>
    </React.Fragment>
  );
};

export default PricesList;
