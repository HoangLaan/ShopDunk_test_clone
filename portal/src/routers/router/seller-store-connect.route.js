import React from 'react';

// Seller Store Connection
const SellerStorePage = React.lazy(() => import('pages/SellerStore/SellerStore'));

// Lazada
const resultConnectionLazada = React.lazy(() => import('pages/SellerStore/Components/ResultConnectLazada'));
const pageLazadaConnect = React.lazy(() => import('pages/SellerStore/Components/Lazada/PageConnect'));
const pageLazadaManager = React.lazy(() => import('pages/SellerStore/Components/Lazada/PageManager'));

// Shopee
const resultConnectionShopee = React.lazy(() => import('pages/SellerStore/Components/ResultConnectShopee'));
const pageShopeeManager = React.lazy(() => import('pages/SellerStore/Components/Shopee/PageManager'));


const SellerStoreRoute = [
  {
    path: '/seller-store-connect',
    exact: true,
    name: 'Liên kết bán hàng',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: SellerStorePage,
  },
  {
    path: '/lazada/code',
    exact: true,
    name: 'Nhận kết quả liên kết gian hàng',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: resultConnectionLazada,
  },
  {
    path: '/seller-store-connect/manage-lazada',
    exact: true,
    name: 'Đồng bộ gian hàng Lazada',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: pageLazadaManager,
  },

  {
    path: '/seller-store-connect/manage-lazada/:id',
    exact: true,
    name: 'Quản lý gian hàng Lazada',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: pageLazadaManager,
  },
  {
    path: '/seller-store-connect/auth-lazada',
    exact: true,
    name: 'Đồng bộ gian hàng Lazada',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: resultConnectionLazada,
  },
  {
    path: '/seller-store-connect/auth-shopee',
    exact: true,
    name: 'Đồng bộ gian hàng Shopee',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: resultConnectionShopee,
  },
  {
    path: '/seller-store-connect/manage-shopee/:id',
    exact: true,
    name: 'Quản lý gian hàng shopee',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: pageShopeeManager,
  },
  {
    path: '/auth-lazada',
    exact: true,
    name: 'Đồng bộ gian hàng Shopee',
    function: 'SELLECT_STORE_CONNECT_VIEW',
    component: resultConnectionLazada,
  },

];

// /seller-store-connect/lazada
export default SellerStoreRoute;