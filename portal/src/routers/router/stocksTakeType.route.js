import React from 'react';

const StocksTakeType = React.lazy(() => import('pages/StocksTakeType/StocksTakeType'));
const StocksTakeTypeAdd = React.lazy(() => import('pages/StocksTakeType/StocksTakeTypeAdd'));
const StocksTakeTypeEdit = React.lazy(() => import('pages/StocksTakeType/StocksTakeTypeEdit'));
const StocksTakeTypeDetail = React.lazy(() => import('pages/StocksTakeType/StocksTakeTypeDetail'));

const stocksTakeTypeRoute = [
  {
    path: '/stocks-take-type',
    exact: true,
    name: 'Danh sách hình thức kiểm kê kho',
    function: 'ST_STOCKSTAKETYPE_VIEW',
    component: StocksTakeType,
  },
  {
    path: '/stocks-take-type/add',
    exact: true,
    name: 'Thêm mới hình thức kiểm kê kho',
    function: 'ST_STOCKSTAKETYPE_ADD',
    component: StocksTakeTypeAdd,
  },
  {
    path: '/stocks-take-type/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức kiểm kê kho',
    function: 'ST_STOCKSTAKETYPE_VIEW',
    component: StocksTakeTypeDetail,
  },
  {
    path: '/stocks-take-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức kiểm kê kho',
    function: 'ST_STOCKSTAKETYPE_EDIT',
    component: StocksTakeTypeEdit,
  },
];

export default stocksTakeTypeRoute;
