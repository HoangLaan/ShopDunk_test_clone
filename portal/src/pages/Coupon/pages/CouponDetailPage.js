import Panel from 'components/shared/Panel/index';
import React, { useEffect, useState } from 'react';
import CouponAddPage from './CouponAddPage';
import { PANEL_TYPES } from '../utils/constants';
import CouponCodeDetail from '../components/detail/CouponCodeDetail';
import AutoCodeDetailPage from '../components/add/AutoCodeDetail';

const CouponDetailPage = ({location}) => {
  const [couponState, setCouponSate ] = useState();

  useEffect(()=>{
    setCouponSate(location?.state?.coupon);
  },[])


  const panel = [
    {
      key: PANEL_TYPES.INFORMATION,
      label: 'Thông tin chung',
      // noActions: true,
      component: CouponAddPage,
    },
    {
      key: PANEL_TYPES.LIST_COUPON,
      label: 'Danh sách mã',
      component: CouponCodeDetail,
      hidden: couponState?.is_auto_gen === 1,
    },
    {
      key: PANEL_TYPES.LIST_AUTO_GEN_COUPON,
      label: 'Danh sách mã',
      component: AutoCodeDetailPage,
      hidden: couponState?.is_auto_gen !== 1,
    },
  ];
  return (
    <div className='bw_main_wrapp' key={couponState?.id}>
      <Panel panes={panel} />
    </div>
  );
};

export default CouponDetailPage;
