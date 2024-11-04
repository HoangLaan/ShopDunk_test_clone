import React, { useState, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { getListRequestByProductImeiCode } from 'services/stocks-detail.service';
const HistoryDetail = () => {
  const { productImeiCode } = useParams();
  const [loading, setLoading] = useState(false);

  const [dataList, setDataList] = useState({
    product: {},
    request_list: [],
  });
  const { product, request_list } = dataList;

  const loadStocksDetailHistory = useCallback(() => {
    setLoading(true);
    getListRequestByProductImeiCode({ product_imei_code: productImeiCode })
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [productImeiCode]);

  useEffect(loadStocksDetailHistory, [loadStocksDetailHistory]);
  return (
    <div className='bw_main_wrapp'>
      <div className='bw_row'>
        <div className='bw_col_3'>
          <div className='bw_inf_prodetail'>
            <img src={product?.image_url} alt={product?.product_name} />
            {/* <img src='bw_image/i_pro.png' alt='s' /> */}
            <h3>{product.product_name}</h3>
            <p>
              Số lượng tồn kho: <span>{product?.quantity}</span>
            </p>
          </div>
          <div className='bw_mores_detail'>
            <p>
              Mã IMEI: <span>{product.product_imei_code}</span>
            </p>
            {/* <p>
              Loại kho:: <span>Kho linh kiện</span>
            </p> */}
            {!!product.order_no && (
              <p>
                Đơn hàng:{' '}
                <span
                  onClick={() => {
                    if (product.order_id) {
                      window.open('/orders/detail/' + product.order_id, '_blank', 'rel=noopener noreferrer');
                    }
                  }}
                  style={{ cursor: 'pointer' }}>
                  {product.order_no}
                </span>
              </p>
            )}
            <p>
              Số ngày lưu kho: <span className='bw_red'>{product.time_inventory} ngày</span>
            </p>
          </div>
        </div>
        <div className='bw_col_1 bw_pb_6' />
        <div className='bw_col_7 bw_pb_6'>
          <div className='bw_list_sevice'>
            {request_list && request_list.length > 0
              ? request_list.map((item, idx) => {
                  return (
                    <div className='bw_service_items'>
                      <h3>{item.created_date}</h3>
                      <div className='bw_service_items_info'>
                        <ul className='bw_list__contentcus'>
                          <li>
                            Hình thức: <b>{item.stocks_type_name}</b>
                          </li>
                          <li>
                            {item.is_import ? 'Nơi nhập' : 'Nơi xuất'}: <b>{item.stocks_name}</b>
                          </li>
                          <li>
                            {item.is_import ? 'Người nhập' : 'Người xuất'}: <b>{item.full_name}</b>
                          </li>
                          <li onClick={() => {
                            window.open(`/stocks-in-request/detail/${item?.stocks_request_id}?tab_active=stocks_in_request`, '_blank');
                          }}>
                            Mã phiếu: <b style={{cursor: 'pointer'}}>{item.stocks_request_code}</b>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryDetail;
