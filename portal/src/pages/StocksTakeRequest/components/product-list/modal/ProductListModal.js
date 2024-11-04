import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable';
import { getListProductStocks } from 'pages/StocksTakeRequest/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import ProductListFilter from './ProductListFilter';

const ProductListModal = ({ open, onClose, isStockTakeImeiCode }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { stocksList, productList } = useSelector((state) => state.stocksTakeRequest);
  const { items, totalItems, page, totalPages, itemsPerPage } = productList;

  const [params, setParams] = useState({
    //stocks_list: methods.watch('stocks_id'),
    is_stocks_take_imei_code: isStockTakeImeiCode,
    page: 1,
    itemsPerPage: 5,
  });

  const columns = [
    {
      header: 'Kho',
      accessor: 'stocks_name',
    },
    {
      header: 'Mã sản phẩm',
      accessor: 'product_code',
    },
    {
      header: 'Mã imei',
      hidden: !isStockTakeImeiCode,
      accessor: 'product_imei_code',
    },
    {
      header: 'Model',
      accessor: 'model_name',
    },
    {
      header: 'Tên sản phẩm',
      accessor: 'product_name',
    },
    {
      header: 'Ngành hàng',
      accessor: 'category_name',
    },
    {
      header: 'Đơn vị tính',
      accessor: 'unit_name',
    },
  ];
  const loadStocksTakeRequest = useCallback(() => {
    if (open) {
      const _paramsFilter = { ...params };
      if (!_paramsFilter.stocks_list) {
        _paramsFilter.stocks_list = methods.watch('stocks_list_id')
      }
      dispatch(getListProductStocks(_paramsFilter));
    }
  }, [dispatch, open, params]);
  useEffect(loadStocksTakeRequest, [loadStocksTakeRequest]);

  return (
    <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`}>
      <div className='bw_modal_container bw_w900'>
        <div className='bw_title_modal'>
          <h3>Chọn sản phẩm kiểm kê</h3>
          <span
            onClick={() => {
              onClose();
            }}
            className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        <div className='bw_main_modal'>
          <ProductListFilter
            onChange={(p) => {
              setParams({
                ...params,
                ...p,
              });
            }}
            stocksListSelect={methods.watch('stocks_list_id')}
            onClear={() => {
              setParams({
                //stocks_id: methods.watch('stocks_id'),
                is_stocks_take_imei_code: isStockTakeImeiCode,
                page: 1,
                itemsPerPage: 5,
              });
            }}
          />
          <div className='bw_box_card bw_mt_1'>
            <DataTable
              fieldCheck={isStockTakeImeiCode ? 'product_imei_code' : 'product_code'}
              columns={columns}
              data={items}
              totalItems={totalItems}
              page={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              defaultDataSelect={methods.watch('product_list')}
              handleBulkAction={(e) => {
                methods.setValue('product_list', e);
              }}
              onChangePage={(page) => {
                setParams({
                  ...params,
                  page,
                });
              }}
            />
          </div>
        </div>
        <div className='bw_footer_modal'>
          <a>
            <button
              type='button'
              onClick={(e) => {
                document.getElementById('trigger-delete').click();
                onClose();
              }}
              className='bw_btn bw_btn_success'>
              <span className='fi fi-rr-check'></span> Chọn sản phẩm
            </button>
          </a>
          <button
            onClick={() => {
              onClose();
            }}
            className='bw_btn_outline'>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductListModal;
