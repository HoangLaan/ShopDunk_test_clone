import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getListHistoryPurchase } from 'services/customer.service';
import { formatPrice } from 'utils/index';
import { defaultPaging, defaultParams } from 'utils/helpers';

import moneyIcon from 'assets/bw_image/icon/i__money_re.svg';
import bagIcon from 'assets/bw_image/icon/i__bags_re.svg';
import completeIcon from 'assets/bw_image/icon/i__completed.svg';

import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';
import PurchaseHistoryFilter from '../filters/PurchaseHistoryFilter';

const PurchaseHistory = () => {
  const { account_id } = useParams();
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(false);
  const onChangeParams = (p) => setParams(prev => ({ ...prev, ...p }))
  const onClearParams = () => setParams(defaultParams)

  const { items, itemsPerPage, page, totalItems, totalPages, statitics } = dataList;

  const loadData = useCallback(() => {
    if (account_id) setLoading(true);
    getListHistoryPurchase({ ...params, member_id: account_id })
      .then((value) => {
        setDataList(value);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account_id, params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã đơn hàng',
        formatter: (p) => (
          <>
            {(
              <CheckAccess permission='SL_ORDER_VIEW'>
                <b>
                  <a href={`../../orders/detail/${p?.order_id}`} rel='noreferrer' target='_blank'>
                    {p.order_no}
                  </a>
                </b>
              </CheckAccess>
            ) || <b>{p.order_no}</b>}
          </>
        ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái đơn hàng',
        accessor: 'order_status',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Giá trị',
        formatter: (p) => formatPrice(p?.total_money, true),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
      },
      {
        header: 'Trang thái giao hàng',
        formatter: (p) => (p?.delivery_status ? 'Đã hoàn thành' : 'Chưa hoàn thành'),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái thanh toán',
        formatter: (p) =>
          p?.payment_status ? (p?.payment_status === 1 ? 'Đã thanh toán' : 'Đang thanh toán') : 'Chưa thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày mua hàng',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Cập nhật cuối',
        accessor: 'updated_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  return (
    <div
      style={{
        marginTop: '15px',
      }}
      className='bw_tab_items bw_active'
      id='bw_insurance'>
      <div class='bw_row'>
        <div class='bw_col_4'>
          <div class='bw_count_cus bw_cou_report'>
            <span class='bw_green'>
              <img alt='' src={moneyIcon} />
            </span>
            <div>
              <h4>{formatPrice(statitics?.total_money, true)}</h4>
              <p>Tổng số tiền đã mua hàng (VND)</p>
            </div>
          </div>
        </div>

        <div class='bw_col_4'>
          <div class='bw_count_cus bw_cou_report'>
            <span class='bw_ogrance'>
              <img alt='' src={bagIcon} />
            </span>
            <div>
              <h4>{statitics?.total_orders || 0}</h4>
              <p>Số lần mua</p>
            </div>
          </div>
        </div>

        <div class='bw_col_4'>
          <div class='bw_count_cus bw_cou_report'>
            <span class='bw_blue'>
              <img alt='' src={completeIcon} />
            </span>
            <div>
              <h4>{statitics?.total_products || 0}</h4>
              <p>Số sản phẩm đã mua</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bw_box_card bw_mt_2'>
        <PurchaseHistoryFilter onChange={onChangeParams} onClearParams={onClearParams} />
        <DataTable
          noSelect
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
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PurchaseHistory;
