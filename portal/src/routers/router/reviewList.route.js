import React from 'react';

const Review = React.lazy(() => import('pages/ReviewList/pages/ReviewListPage'));
const ReviewAdd = React.lazy(() => import('pages/ReviewList/pages/ReviewAdd'));
const ReviewEdit = React.lazy(() => import('pages/ReviewList/pages/ReviewEdit'));
const ReviewDetail = React.lazy(() => import('pages/ReviewList/pages/ReviewDetail'));

const reviewList = [
  {
    path: '/review-list',
    exact: true,
    name: 'DANH SÁCH ĐÁNH GIÁ',
    function: 'SL_ORDER_VIEW',
    component: Review,
  },
  {
    path: '/review-list/add',
    exact: true,
    name: 'Thêm mới',
    function: 'SL_ORDER_ADD',
    component: ReviewAdd,
  },
  {
    path: '/review-list/edit/:id',
    exact: true,
    name: 'CHI TIẾT ĐẶT LỊCH',
    function: 'SL_ORDER_EDIT',
    component: ReviewEdit,
  },
  {
    path: '/review-list/detail/:id',
    exact: true,
    name: 'CHI TIẾT ĐẶT LỊCH',
    function: 'SL_ORDER_EDIT',
    component: ReviewDetail,
  },
  // {
  //   path: '/orders/payment/:order_id',
  //   exact: true,
  //   name: 'Thông tin thanh toán đơn hàng',
  //   function: 'SL_ORDER_EDIT',
  //   component: OrdersPayment,
  // },
];

export default reviewList;
