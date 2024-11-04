import React from 'react';
import { COUPON_PERMISSION } from 'pages/Coupon/utils/constants';
import CouponDetailPage from 'pages/Coupon/pages/CouponDetailPage';

// #region
const CouponPage = React.lazy(() => import('pages/Coupon/pages/CouponPage'));
const CouponAddPage = React.lazy(() => import('pages/Coupon/pages/CouponAddPage'));

const ComponentGroupRoutes = [
  // dashboard
  {
    path: '/coupon',
    exact: true,
    name: 'Danh sách mã giảm giá',
    any: true,
    function: COUPON_PERMISSION.VIEW,
    component: CouponPage,
  },
  {
    path: '/coupon/add',
    exact: true,
    name: 'Thêm mới mã giảm giá',
    any: true,
    function: COUPON_PERMISSION.ADD,
    component: CouponAddPage,
  },
  {
    path: '/coupon/edit/:coupon_id',
    exact: true,
    name: 'Chỉnh sửa mã giảm giá',
    any: true,
    function: COUPON_PERMISSION.EDIT,
    component: CouponAddPage,
  },
  {
    path: '/coupon/detail/:coupon_id',
    exact: true,
    name: 'Chi tiết mã giảm giá',
    any: true,
    function: COUPON_PERMISSION.VIEW,
    component: CouponDetailPage,
  },
];

// #endregion

export default ComponentGroupRoutes;
