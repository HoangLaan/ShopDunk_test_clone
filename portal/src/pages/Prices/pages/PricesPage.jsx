import React, { useCallback, useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { deleteItem, getList } from 'pages/Prices/helpers/call-api';
import PricesTable from 'pages/Prices/components/table-prices/PricesTable';
import PricesFilter from 'pages/Prices/components/table-prices/PricesFilter';
import { checkProductType, defendPriceDateUsing } from '../components/contain/contain';
import ImportExcel from 'pages/Prices/components/import-excel/ImportExcel';

const PricesPage = () => {
  const { search } = useLocation();
  const { product_identity, model_identity, imei_identity, product_type_param, product_type_pro_mat } = queryString.parse(search);
  const [productTypeId, setProductTypeId] = useState(checkProductType['2']);

  const [params, setParams] = useState({
    page: 1,
    product_type_id: checkProductType['2'],
    itemsPerPage: 25,
    is_active: 1,
    is_review: 4,
    status_apply_id: 2,
    product_type_pro_mat: null
  });
  const [dataPricesPage, setDataPricesPage] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    product_type_id: checkProductType['2'],
    totalItems: 0,
    totalPages: 0,
    status_apply_id: 2,
    product_type_pro_mat: null
  });
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataPricesPage;

  const loadPricesPage = useCallback(() => {
    let cloneParams = structuredClone(params);
    const product_id = product_identity ? parseInt(product_identity) : null;
    const model_id = model_identity ? parseInt(model_identity) : null;
    const imei_code = imei_identity ? imei_identity : null;
    const product_type = product_type_param ? parseInt(product_type_param) : null;
    const product_type_pro_or_mat = product_type_pro_mat ? parseInt(product_type_pro_mat) : null;

    // eslint-disable-next-line default-case
    if (product_id) {
      cloneParams.product_id = product_id;
    }
    if (model_id) {
      cloneParams.model_id = model_id;
    }
    if (imei_code) {
      cloneParams.imei_code = imei_code;
    }
    if (product_type_pro_or_mat) {
      cloneParams.product_type_pro_mat = product_type_pro_or_mat;
    }
    if (product_type) {
      cloneParams.product_type_id = product_type;
    } else {
      cloneParams.product_type_id = productTypeId;
    }

    setLoading(true);
    getList(cloneParams)
      .then(setDataPricesPage)
      .finally(() => {
        setLoading(false);
      });
  }, [params, product_type_param]);

  useEffect(() => {
    loadPricesPage();
    return () => {};
  }, [loadPricesPage, product_type_param]);

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

  const defaultValueFilter = {
    search: '',
    output_type_id: null,
    is_review: 4,
    date_from: null,
    date_to: null,
    status_apply_id: 2,
    is_active: 1,
    model_id: null,
    product_category_id: null,
    page: 1,
  };

  const onRefresh = () => {
    let cloneDefaultValueFilter = structuredClone(defaultValueFilter);
    setParams({
      ...params,
      ...cloneDefaultValueFilter,
    });
  };

  const [openModalImport, setOpenModalImport] = useState(null);

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PricesFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
          paramsStatus={params?.status_apply_id}
          defaultValueFilter={defaultValueFilter}
          onRefresh={() => onRefresh()}
        />
        <PricesTable
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
          productTypeParam={product_type_param}
          params={params}
          setParams={setParams}
          setProductTypeId={setProductTypeId}
          onRefresh={() => onRefresh()}
          importExcel={() => setOpenModalImport(true)}
        />
        {openModalImport && <ImportExcel onClose={handleCloseModalImport}  onRefresh={() => onRefresh()} />}
      </div>
    </React.Fragment>
  );
};

export default PricesPage;
