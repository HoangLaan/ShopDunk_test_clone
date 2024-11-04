import React from 'react';

const StocksOutType = React.lazy(() => import('pages/StocksOutType/StocksOutType'));
const StocksOutTypeAdd = React.lazy(() => import('pages/StocksOutType/StocksOutTypeAdd'));
const StocksOutTypeEdit = React.lazy(() => import('pages/StocksOutType/StocksOutTypeEdit'));
const StocksOutTypeDetail = React.lazy(() => import('pages/StocksOutType/StocksOutTypeDetail'));

const stocksOutTypeRoute = [
  {
    path: '/stocks-out-type',
    exact: true,
    name: 'Danh sách hình thức xuất kho',
    function: 'ST_STOCKSOUTTYPE_VIEW',
    component: StocksOutType,
  },
  {
    path: '/stocks-out-type/add',
    exact: true,
    name: 'Thêm mới hình thức xuất kho',
    function: 'ST_STOCKSOUTTYPE_ADD',
    component: StocksOutTypeAdd,
  },
  {
    path: '/stocks-out-type/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức xuất kho',
    function: 'ST_STOCKSOUTTYPE_VIEW',
    component: StocksOutTypeDetail,
  },
  {
    path: '/stocks-out-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức xuất kho',
    function: 'ST_STOCKSOUTTYPE_EDIT',
    component: StocksOutTypeEdit,
  },
];

export default stocksOutTypeRoute;
