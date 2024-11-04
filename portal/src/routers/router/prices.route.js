import React from 'react';

const Prices = React.lazy(() => import('pages/Prices/pages/PricesPage'));
const PricesList = React.lazy(() => import('pages/Prices/pages/PricesList'));
const PricesAdd = React.lazy(() => import('pages/Prices/pages/PricesAdd'));
const PricesListDetail = React.lazy(() => import('pages/Prices/pages/PricesListDetail'));
const PricesDetail = React.lazy(() => import('pages/Prices/pages/PricesDetail'));
const PricesEdit = React.lazy(() => import('pages/Prices/pages/PricesEdit'));
const PricesHistory = React.lazy(() => import('pages/Prices/pages/PricesHistory'));

const prices = [
  {
    path: '/prices',
    exact: true,
    name: 'Danh sách giá',
    function: 'SL_PRICES_VIEW',
    component: Prices,
  },
  {
    path: '/prices-list',
    exact: true,
    name: 'Danh sách làm giá',
    function: 'SL_PRICES_VIEW',
    component: PricesList,
  },
  {
    path: '/prices-list/add',
    exact: true,
    name: 'Danh sách làm giá',
    function: 'SL_PRICES_ADD',
    component: PricesAdd,
  },
  {
    path: '/prices-list/view/:productTypeDeff/:productId/:outputTypeId/:imeiCode',
    exact: true,
    name: 'Danh sách làm giá',
    function: 'SL_PRICES_ADD',
    component: PricesListDetail,
  },
  {
    path: '/prices/add',
    exact: true,
    name: 'Danh sách làm giá',
    function: 'SL_PRICES_ADD',
    component: PricesAdd,
  },
  {
    path: '/prices/view/:productTypeDeff/:productId/:priceId/:areaId/:outputTypeId/:typePriceId/:unitId/:imeiCode',
    exact: true,
    name: 'Chi tiết làm giá sản phẩm',
    function: 'SL_PRICES_VIEW',
    component: PricesListDetail,
  },
  {
    path: '/prices/review/:productId/:priceId',
    exact: true,
    name: 'Chi tiết giá sản phẩm',
    function: 'SL_PRICES_VIEW',
    component: PricesListDetail,
  },
  {
    path: '/prices/detail/:productTypeDeff/:productId/:priceId/:areaId',
    exact: true,
    name: 'Chi tiết giá sản phẩm',
    function: 'SL_PRICES_VIEW',
    component: PricesDetail,
  },
  {
    path: '/prices/edit/:productTypeDeff/:productId/:priceId',
    exact: true,
    name: 'Chỉnh sửa làm giá sản phẩm',
    function: 'SL_PRICES_VIEW',
    component: PricesEdit,
  },
  {
    path: '/prices/history/:productId/:priceId',
    exact: true,
    name: 'Lịch sử làm giá sản phẩm',
    function: 'SL_PRICES_VIEW',
    component: PricesHistory,
  },
];

export default prices;
