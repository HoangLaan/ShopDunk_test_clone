import React from 'react';

const ExchangePointAdd = React.lazy(() => import('pages/ExchangePoint/pages/ExchangePointAdd'));
const ExchangePointPage = React.lazy(() => import('pages/ExchangePoint/pages/ExchangePointPage'));

const exchangePoint = [
  {
    path: '/exchange-point',
    exact: true,
    name: 'Danh sách tiêu điểm',
    function: 'PT_EXCHANGEPOINT_VIEW',
    component: ExchangePointPage,
  },
  {
    path: '/exchange-point/add',
    exact: true,
    name: 'Thiết lập tiêu điểm',
    function: 'PT_EXCHANGEPOINT_ADD',
    component: ExchangePointAdd,
  },
  {
    path: '/exchange-point/edit/:ex_point_id',
    exact: true,
    name: 'Chỉnh sửa thiết lập tiêu điểm',
    function: 'PT_EXCHANGEPOINT_EDIT',
    component: ExchangePointAdd,
  },
  {
    path: '/exchange-point/detail/:ex_point_id',
    exact: true,
    name: 'Chi tiết thiết lập tiêu điểm ',
    function: 'PT_EXCHANGEPOINT_VIEW',
    component: ExchangePointAdd,
  },
];

export default exchangePoint;
