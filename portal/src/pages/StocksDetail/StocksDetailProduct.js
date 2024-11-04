import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { getListProductImeiCodeStocks } from 'services/stocks-detail.service';

import FormSection from 'components/shared/FormSection';
//components
import TableDetail from './components/StocksDetailProduct/TableDetail';
import FilterDetail from './components/StocksDetailProduct/FilterDetail';
import { formatQuantity } from 'utils/number';
import CheckAccess from 'navigation/CheckAccess';

const StocksDetailProduct = () => {
  const { stocksId, productId, materialId } = useParams();

  const defaultParams = {
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
    stocks_id: stocksId,
    product_id: productId,
    material_id: materialId,
    is_out_of_stock: 1,
  };

  const [params, setParams] = useState(defaultParams);
  const onClearParams = () => setParams(defaultParams);

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const {
    items,
    itemsPerPage,
    page,
    totalItems,
    totalPages,
    total_inventory,
    total_cost_price,
    total_cost_basic_imei_code,
  } = dataList;

  const loadStocksDetailProduct = useCallback(() => {
    setLoading(true);
    getListProductImeiCodeStocks(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadStocksDetailProduct, [loadStocksDetailProduct]);

  // const calTotal = useCallback(
  //   (column) => formatQuantity(items.reduce((acc, cur) => (acc += cur[column]), 0)),
  //   [items],
  // );
  // const totalCostPrice = useMemo(() => calTotal('cost_price'), [calTotal]);
  // const totalCostBasic = useMemo(() => calTotal('cost_basic_imei_code'), [calTotal]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp detail_inventory'>
        <FilterDetail
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClearParams={onClearParams}
        />
        <div className='bw_row bw_align_items_left bw_mt_2 '>
          <div className='bw_col_6 '>
            <div className='bw_inf_prodetail'>
              <img src={items[0]?.image_url} alt={items[0]?.product_name} />
              <h3>{items[0]?.product_name}</h3>
              <p>
                Số lượng tồn kho: <span>{totalItems > 9 ? total_inventory : `${total_inventory}`}</span>
              </p>
              <CheckAccess permission={'ST_PRICEIMEICODE_VIEW'}>
                <p>
                  Giá trị tồn kho theo đơn giá nhập: <span>{formatQuantity(total_cost_price)}</span>
                </p>
              </CheckAccess>
              {/* <CheckAccess permission={'ST_PRICEIMEICODE_VIEW'}>
                <p>
                  Giá trị tồn kho theo đơn giá vốn: <span>{formatQuantity(total_cost_basic_imei_code)}</span>
                </p>
              </CheckAccess> */}
            </div>
          </div>
          <div className='bw_col_8 bw_flex bw_align_items_center bw_justify_content_right bw_btn_group'></div>
        </div>

        <TableDetail
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChangeParams={(query) => {
            setParams((prev) => {
              return {
                ...prev,
                ...query,
              };
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadStocksDetailProduct}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksDetailProduct;
