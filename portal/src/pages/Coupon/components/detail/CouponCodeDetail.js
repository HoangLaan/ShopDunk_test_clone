import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo } from 'react';
import CouponCodeCount from './CouponCodeCount';
import { formatPrice } from 'utils/index';
import { useParams } from 'react-router-dom';
import { getListCouponService } from 'services/coupon.service';

const CouponCodeDetail = () => {
  const { coupon_id } = useParams();
  const [data, setData] = React.useState([]);

  const columns = React.useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã khuyến mại',
        accessor: 'coupon_code',
      },
      {
        header: 'Giá trị',
        formatter: (p) => {
          return formatPrice(p?.code_value);
        },
      },
      {
        header: 'Số lượng',
        accessor: 'quantity',
      },
      {
        header: 'Số lượng đã áp dụng',
        accessor: 'total_code_applied',
      },
      {
        header: 'Số lượng chưa áp dụng',
        formatter: (p) => {
          return p?.quantity - p?.total_code_applied;
        },
      },
    ],
    [],
  );

  const loadCouponDetail = useCallback(() => {
    if (coupon_id) {
      getListCouponService(coupon_id).then((value) => {
        setData(value);
      });
    }
  }, [coupon_id]);

  useEffect(loadCouponDetail, [loadCouponDetail]);

  const totalCoupon = useMemo(() => {
    return (data ?? []).reduce(function (acc, obj) {
      return acc + parseInt(obj.quantity);
    }, 0);
  }, [data]);

  const totalCouponApplied = useMemo(() => {
    return (data ?? []).reduce(function (acc, obj) {
      return acc + parseInt(obj.total_code_applied);
    }, 0);
  }, [data]);

  return (
    <React.Fragment>
      <div className='bw_row bw_mt_1'>
        <div className='bw_col_3'>
          <CouponCodeCount value={totalCoupon} label='Tổng số lượng mã' />
        </div>
        <div className='bw_col_3'>
          <CouponCodeCount className='bw_blue' value={totalCouponApplied} label='Đã áp dụng' />{' '}
        </div>
        <div className='bw_col_3'>
          <CouponCodeCount className='bw_red' value={totalCoupon - totalCouponApplied} label='Chưa áp dụng' />
        </div>
      </div>
      <DataTable noSelect noPaging noActions columns={columns} data={data ?? []} />
    </React.Fragment>
  );
};

export default CouponCodeDetail;
