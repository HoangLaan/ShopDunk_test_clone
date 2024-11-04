import React from 'react';

const Stocks = React.lazy(() => import('pages/Stocks/Stocks'));
const StocksAdd = React.lazy(() => import('pages/Stocks/StocksAdd'));
const StocksEdit = React.lazy(() => import('pages/Stocks/StocksEdit'));
const StocksDetail = React.lazy(() => import('pages/Stocks/StocksDetail'));

const stocksRoute = [
  {
    path: '/stocks',
    exact: true,
    name: 'Danh sách kho hàng',
    function: 'ST_STOCKS_VIEW',
    component: Stocks,
  },
  {
    path: '/stocks/add',
    exact: true,
    name: 'Thêm mới kho hàng',
    function: 'ST_STOCKS_ADD',
    component: StocksAdd,
  },
  {
    path: '/stocks/detail/:id',
    exact: true,
    name: 'Chi tiết kho hàng',
    function: 'ST_STOCKS_VIEW',
    component: StocksDetail,
  },
  {
    path: '/stocks/edit/:id',
    exact: true,
    name: 'Chỉnh sửa kho hàng',
    function: 'ST_STOCKS_EDIT',
    component: StocksEdit,
  },
];

export default stocksRoute;
