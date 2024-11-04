import React from 'react';
import { COUPON_PERMISSION } from '../utils/constants';

// #region
const CouponPage = React.lazy(() => import('pages/Coupon/pages/CouponPage'));
const CouponAddPage = React.lazy(() => import('pages/Coupon/pages/CouponAddPage'));

const routesCoupon = [
  // dashboard
  {
    path: '/coupon',
    exact: true,
    name: 'Danh sách mã khuyến mại',
    any: true,
    function: COUPON_PERMISSION.VIEW,
    component: CouponPage,
  },
  {
    path: '/coupon/add',
    exact: true,
    name: 'Thêm mã khuyến mại',
    any: true,
    function: COUPON_PERMISSION.ADD,
    component: CouponAddPage,
  },
];

// #endregion

export { routesCoupon };
