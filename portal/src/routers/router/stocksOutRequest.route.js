import React from 'react';

const StocksOutRequestPage = React.lazy(() => import('pages/StocksOutRequest/StocksOutRequestPage'));
const StocksOutRequestAddPage = React.lazy(() => import('pages/StocksOutRequest/StocksOutRequestAddPage'));

const stocksOutRequestRoute = [
  {
    path: '/stocks-out-request',
    exact: true,
    name: 'Danh sách phiếu xuất kho',
    function: 'ST_STOCKSOUTREQUEST_VIEW',
    component: StocksOutRequestPage,
  },
  {
    path: '/stocks-out-request/add',
    exact: true,
    name: 'Thêm mới phiếu xuất kho ',
    function: 'ST_STOCKSOUTREQUEST_ADD',
    component: StocksOutRequestAddPage,
  },
  {
    path: '/stocks-out-request/edit/:stocks_out_request_id',
    exact: true,
    name: 'Chỉnh sửa phiếu xuất kho',
    function: 'ST_STOCKSOUTREQUEST_EDIT',
    component: StocksOutRequestAddPage,
  },
  {
    path: '/stocks-out-request/detail/:stocks_out_request_id',
    exact: true,
    // name: 'Chi tiết phiếu xuất kho lúc chia hàng',
    name: 'Chi tiết phiếu xuất kho',
    function: 'ST_STOCKSOUTREQUEST_VIEW',
    component: () => <StocksOutRequestAddPage />,
  },
];

export default stocksOutRequestRoute;
