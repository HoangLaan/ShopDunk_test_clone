import React, { useCallback, useState, useEffect } from 'react';
import queryString from 'query-string';
import { showToast } from 'utils/helpers';
import { useParams } from 'react-router-dom';

import {
  deleteItem,
  detailPrices,
  detailProduct,
  detailPricesByOption,
  detailPriceProduct,
} from 'pages/Prices/helpers/call-api';
import PricesDetailTable from 'pages/Prices/components/table-prices-detail/PricesDetailTable';

const PricesListDetail = () => {
  const { productTypeDeff, productId, priceId, areaId, outputTypeId, typePriceId, unitId, imeiCode } = useParams();
  const { product_type = 1 } = queryString.parse(window.location.search);
  const [detailPricesProduct, setDetailPricesProduct] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
  });
  const [dataPricesPage, setDataPricesPage] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataPricesPage;

  const loadPricesPage = useCallback(async () => {
    setLoading(true);

    try {
      if (productId) {
        const _detailProduct = await detailProduct(productId, {
          product_type: product_type,
          product_imei_code: imeiCode,
          product_type_deff :productTypeDeff,
        });
        setDetailPricesProduct(_detailProduct);
        let imei_code = imeiCode;
        if (imeiCode == '' || imeiCode == 'null') {
          imei_code = null;
        }

        let _detailPrices = [];
        if (priceId && areaId && outputTypeId && typePriceId) {
          _detailPrices = await detailPricesByOption(productId, {
            ...params,
            price_id: priceId,
            area_id: areaId,
            product_type: outputTypeId,
            type_price_id: typePriceId,
            imei_code: imei_code,
            unit_id: unitId,
            product_type_deff :productTypeDeff,
          });
        } else if (priceId) {
          _detailPrices = await detailPrices(productId, {
            ...params,
            price_id: priceId,
            product_type_deff :productTypeDeff,
          });
        } else {
          _detailPrices = await detailPriceProduct(productId, {
            ...params,
            product_type: outputTypeId,
            imei_code: imei_code,
            product_type_deff :productTypeDeff,
          });
        }

        setDataPricesPage(_detailPrices);
      }
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  }, [params, priceId, productId, product_type]);

  useEffect(() => {
    loadPricesPage();
  }, [loadPricesPage]);

  const handleDelete = async (price_id) => {
    // Lấy ra vị trí
    deleteItem(price_id)
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
        <div className='bw_search_box'>
          <h3 className='bw_title_search'>
            Thông tin sản phẩm {detailPricesProduct?.product_name} <span className='bw_close_search'></span>
          </h3>
          <div className='bw_row bw_mt_1'>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_disable'>
                <label>Công ty</label>

                <textarea
                  value={detailPricesProduct?.company_name}
                  rows='2'
                  style={{ overflow: 'hidden', resize: 'none' }}
                  disabled></textarea>
              </div>
            </div>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_disable'>
                <div style={{ display: 'flex' }}>
                  <div>
                    <label>Mã sản phẩm</label>

                    <textarea
                      value={detailPricesProduct?.product_code}
                      rows='2'
                      style={{ overflow: 'hidden', resize: 'none' }}
                      disabled></textarea>
                  </div>
                  {detailPricesProduct?.product_imei && (
                    <div>
                      <label>Imei</label>
                      <textarea
                        value={detailPricesProduct?.product_imei}
                        rows='2'
                        style={{ overflow: 'hidden', resize: 'none' }}
                        disabled></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='bw_col_3 '>
              <div className='bw_frm_box bw_disable'>
                <label>Tên model sản phẩm</label>

                <textarea
                  value={detailPricesProduct?.model_name}
                  rows='2'
                  style={{ overflow: 'hidden', resize: 'none' }}
                  disabled></textarea>
              </div>
            </div>
            <div className='bw_col_3'>
              <div className='bw_frm_box bw_disable'>
                <label>Nhà sản xuất</label>
                <textarea
                  value={detailPricesProduct?.manufacturer_name || 'Không xác định'}
                  rows='2'
                  style={{ overflow: 'hidden', resize: 'none' }}
                  disabled></textarea>
              </div>
            </div>
          </div>
        </div>

        <PricesDetailTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={totalItems}
          page={page}
          loading={loading}
          totalItems={totalItems}
          detailPricesProduct={detailPricesProduct}
          productImeiParam={detailPricesProduct?.product_imei ?? ''}
        />
      </div>
    </React.Fragment>
  );
};

export default PricesListDetail;
