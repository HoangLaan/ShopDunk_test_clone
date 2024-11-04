import React from 'react';

const StocksInRequestPage = React.lazy(() => import('pages/StocksInRequest/StocksInRequestPage'));
const StocksInRequestAddPage = React.lazy(() => import('pages/StocksInRequest/StocksInRequestAddPage'));

const stocksInRequestRoute = [
  {
    path: '/stocks-in-request',
    exact: true,
    name: 'Danh sách phiếu nhập kho',
    function: 'ST_STOCKSINREQUEST_VIEW',
    component: StocksInRequestPage,
  },
  {
    path: '/stocks-in-request/add',
    exact: true,
    name: 'Thêm mới phiếu nhập kho',
    function: 'ST_STOCKSINREQUEST_ADD',
    component: StocksInRequestAddPage,
  },
  {
    path: '/stocks-in-request/detail/:stocks_in_request_id',
    exact: true,
    name: 'Chi tiết phiếu nhập kho',
    function: 'ST_STOCKSINREQUEST_VIEW',
    component: StocksInRequestAddPage,
  },
  {
    path: '/stocks-in-request/edit/:stocks_in_request_id',
    exact: true,
    name: 'Chỉnh sửa phiếu nhập kho',
    function: 'ST_STOCKSINREQUEST_EDIT',
    component: StocksInRequestAddPage,
  },
];

export default stocksInRequestRoute;
