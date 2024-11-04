import React from 'react';

const StocksReviewLevel = React.lazy(() => import('pages/StocksReviewLevel/StocksReviewLevel'));
const StocksReviewLevelAdd = React.lazy(() => import('pages/StocksReviewLevel/StocksReviewLevelAdd'));
const StocksReviewLevelEdit = React.lazy(() => import('pages/StocksReviewLevel/StocksReviewLevelEdit'));
const StocksReviewLevelDetail = React.lazy(() => import('pages/StocksReviewLevel/StocksReviewLevelDetail'));

const stocksReviewLevelRoute = [
  {
    path: '/stocks-review-level',
    exact: true,
    name: 'Danh sách mức duyệt xuất/ nhập/ kiểm kê kho',
    function: 'ST_STOCKSREVIEWLEVEL_VIEW',
    component: StocksReviewLevel,
  },
  {
    path: '/stocks-review-level/add',
    exact: true,
    name: 'Thêm mới mức duyệt xuất/ nhập/ kiểm kê kho',
    function: 'ST_STOCKSREVIEWLEVEL_ADD',
    component: StocksReviewLevelAdd,
  },
  {
    path: '/stocks-review-level/detail/:id',
    exact: true,
    name: 'Chi tiết mức duyệt xuất/ nhập/ kiểm kê kho',
    function: 'ST_STOCKSREVIEWLEVEL_VIEW',
    component: StocksReviewLevelDetail,
  },
  {
    path: '/stocks-review-level/edit/:id',
    exact: true,
    name: 'Chỉnh sửa mức duyệt xuất/ nhập/ kiểm kê kho',
    function: 'ST_STOCKSREVIEWLEVEL_EDIT',
    component: StocksReviewLevelEdit,
  },
];

export default stocksReviewLevelRoute;
