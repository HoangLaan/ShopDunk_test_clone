import { ROUTE_STOCKS_TAKE_REQUEST, STOCKS_TAKE_REQUEST_PERMISSION } from 'pages/StocksTakeRequest/utils/constants';
import React from 'react';

const StocksTakeRequestPage = React.lazy(() => import('pages/StocksTakeRequest/pages/StocksTakeRequestPage'));
const StocksTakeRequestAddPage = React.lazy(() => import('pages/StocksTakeRequest/pages/StocksTakeRequestAddPage'));

const stocksReviewLevelRoute = [
  {
    path: ROUTE_STOCKS_TAKE_REQUEST.MAIN,
    exact: true,
    name: 'Danh sách phiếu kiểm kê',
    function: STOCKS_TAKE_REQUEST_PERMISSION.VIEW,
    component: StocksTakeRequestPage,
  },
  {
    path: ROUTE_STOCKS_TAKE_REQUEST.ADD,
    exact: true,
    name: 'Thêm mới phiếu kiểm kê',
    function: STOCKS_TAKE_REQUEST_PERMISSION.ADD,
    component: StocksTakeRequestAddPage,
  },
  {
    path: ROUTE_STOCKS_TAKE_REQUEST.MAIN + '/edit/:stocks_take_request_id',
    exact: true,
    name: 'Chỉnh sửa phiếu kiểm kê',
    function: STOCKS_TAKE_REQUEST_PERMISSION.EDIT,
    component: StocksTakeRequestAddPage,
  },
  {
    path: ROUTE_STOCKS_TAKE_REQUEST.MAIN + '/:stocks_take_request_id/detail',
    exact: true,
    name: 'Chi tiết phiếu kiểm kê',
    function: STOCKS_TAKE_REQUEST_PERMISSION.VIEW,
    component: StocksTakeRequestAddPage,
  },
];

export default stocksReviewLevelRoute;
