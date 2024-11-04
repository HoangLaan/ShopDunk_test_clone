import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductImeiInventory } from 'services/stocks-out-request.service';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { defaultPaging } from 'utils/helpers';
import ProductImeiFilter from 'pages/StocksOutRequest/components/add/modal/ProductImeiFilter';
import StocksOutTableConfig from 'pages/StocksOutRequest/components/main/TableConfig/StocksOutTableConfig';

const ProductImeiModal = ({ maxSelect, field, productId, materialId, stocksId, onClose }) => {
  const methods = useFormContext();
  const { stocks_out_request_id } = useParams();
  const [params, setParams] = useState({
    search: null,
    product_id: productId,
    stocks_out_request_id: stocks_out_request_id,
    material_id: materialId,
    stocks_id: stocksId,
    itemsPerPage: 5,
    currentPage: 1,
  });

  const [loading, setLoading] = useState(false);

  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const columns = useMemo(
    () => [
      {
        header: 'SKU',
        formatter: (e) => e?.product_imei_code || e?.material_imei_code,
      },
      {
        header: 'Mã',
        formatter: (e) => e?.product_code || e?.material_code,
      },
      {
        header: 'Tên sản phẩm',
        formatter: (e) => e?.product_name || e?.material_name,
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
      },
      {
        header: 'Ngày nhập kho',
        accessor: 'created_date',
      },
    ],
    [],
  );

  const loadProductImei = useCallback(() => {
    setLoading(true);
    getProductImeiInventory(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadProductImei, [loadProductImei]);

  return (
    <div className='bw_modal bw_modal_open' id='bw_skill'>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Thêm sản phẩm</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <ProductImeiFilter
            onClear={() => {
              setParams({
                search: null,
                product_id: productId,
                stocks_id: stocksId,
                stocks_out_request_id: stocks_out_request_id,
                material_id: materialId,
                itemsPerPage: 5,
                currentPage: 1,
              });
            }}
            onChange={(value) => {
              setParams({
                ...params,
                ...value,
              });
            }}
          />
          <StocksOutTableConfig
            defaultDataSelect={methods.watch(`${field}.list_imei`) ?? []}
            maxSelect={maxSelect}
            loading={loading}
            columns={columns}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            noSelect={false}
            onChangePage={(page) => {
              setParams({
                ...params,
                page,
              });
            }}
            handleBulkAction={(e) => {
              methods.setValue(`${field}.list_imei`, e);
            }}
          />
        </div>
        <div className='bw_footer_modal'>
          <button
            className='bw_btn bw_btn_success'
            type='button'
            onClick={() => {
              document.getElementById('trigger-add-stock-out').click();
              onClose();
            }}>
            Chọn sản phẩm
          </button>
          <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImeiModal;
