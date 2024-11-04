import React from 'react';

const StocksInType = React.lazy(() => import('pages/StocksInType/StocksInType'));
const StocksInTypeAdd = React.lazy(() => import('pages/StocksInType/StocksInTypeAdd'));
const StocksInTypeEdit = React.lazy(() => import('pages/StocksInType/StocksInTypeEdit'));
const StocksInTypeDetail = React.lazy(() => import('pages/StocksInType/StocksInTypeDetail'));

const stocksInTypeRoute = [
  {
    path: '/stocks-in-type',
    exact: true,
    name: 'Danh sách hình thức nhập kho',
    function: 'ST_STOCKSINTYPE_VIEW',
    component: StocksInType,
  },
  {
    path: '/stocks-in-type/add',
    exact: true,
    name: 'Thêm mới hình thức nhập kho',
    function: 'ST_STOCKSINTYPE_ADD',
    component: StocksInTypeAdd,
  },
  {
    path: '/stocks-in-type/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức nhập kho',
    function: 'ST_STOCKSINTYPE_VIEW',
    component: StocksInTypeDetail,
  },
  {
    path: '/stocks-in-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức nhập kho',
    function: 'ST_STOCKSINTYPE_EDIT',
    component: StocksInTypeEdit,
  },
];

export default stocksInTypeRoute;
