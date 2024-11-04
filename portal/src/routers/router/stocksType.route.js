import React from 'react';

const StocksType = React.lazy(() => import('pages/StocksType/StocksType'));
const StocksTypeAdd = React.lazy(() => import('pages/StocksType/StocksTypeAdd'));
const StocksTypeEdit = React.lazy(() => import('pages/StocksType/StocksTypeEdit'));
const StocksTypeDetail = React.lazy(() => import('pages/StocksType/StocksTypeDetail'));

const stocksTypeRoute = [
  {
    path: '/stocks-type',
    exact: true,
    name: 'Danh sách loại kho',
    function: 'ST_STOCKSTYPE_VIEW',
    component: StocksType,
  },
  {
    path: '/stocks-type/add',
    exact: true,
    name: 'Thêm mới loại kho',
    function: 'ST_STOCKSTYPE_ADD',
    component: StocksTypeAdd,
  },
  {
    path: '/stocks-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại kho',
    function: 'ST_STOCKSTYPE_VIEW',
    component: StocksTypeDetail,
  },
  {
    path: '/stocks-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại kho',
    function: 'ST_STOCKSTYPE_EDIT',
    component: StocksTypeEdit,
  },
];

export default stocksTypeRoute;
