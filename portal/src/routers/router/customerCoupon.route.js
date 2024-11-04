import React from 'react';
import { CUSTOMER_COUPON_PERMISSION } from 'pages/CustomerCoupon/utils/constants';

const CustomerCoupon = React.lazy(() => import('pages/CustomerCoupon/pages/CustomerCoupon'));
const CustomerCouponAdd = React.lazy(() => import('pages/CustomerCoupon/pages/CustomerCouponAdd'));

const customerVoucherRoute = [
  {
    path: '/customer-coupon',
    exact: true,
    name: 'Danh sách mã giảm giá - khách hàng',
    function: CUSTOMER_COUPON_PERMISSION.VIEW,
    component: CustomerCoupon,
  },
  {
    path: '/customer-coupon/edit/:customerVoucherId',
    exact: true,
    name: 'Chỉnh sửa mã giảm giá - khách hàng',
    function: CUSTOMER_COUPON_PERMISSION.EDIT,
    component: CustomerCouponAdd,
  },
  {
    path: '/customer-coupon/detail/:customerVoucherId',
    exact: true,
    name: 'Chỉnh sửa mã giảm giá - khách hàng',
    function: CUSTOMER_COUPON_PERMISSION.VIEW,
    component: CustomerCouponAdd,
  },
];

export default customerVoucherRoute;
