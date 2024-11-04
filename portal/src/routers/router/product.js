import React from 'react';

const Product = React.lazy(() => import('pages/Product/Product'));
const ProductAdd = React.lazy(() => import('pages/Product/ProductAdd'));
const ProductBarcode = React.lazy(() => import('pages/Product/ProductBarcode'));

const product = [
  {
    path: '/product',
    exact: true,
    name: 'Danh sách hàng hóa - vật tư',
    function: 'MD_PRODUCT_VIEW',
    component: Product,
  },
  {
    path: '/product/add',
    exact: true,
    name: 'Thêm mới hàng hóa - vật tư',
    function: 'MD_PRODUCT_ADD',
    component: ProductAdd,
  },
  {
    path: '/product/detail/:product_id',
    exact: true,
    name: 'Chi tiết hàng hóa - vật tư',
    function: 'MD_PRODUCT_VIEW',
    component: ProductAdd,
  },
  {
    path: '/product/edit/:product_id',
    exact: true,
    name: 'Chỉnh sửa hàng hóa - vật tư',
    function: 'MD_PRODUCT_EDIT',
    component: ProductAdd,
  },
  {
    path: '/product/add/:product_id',
    exact: true,
    name: 'Sao chép hàng hóa - vật tư',
    function: 'MD_PRODUCT_ADD',
    component: ProductAdd,
  },
  {
    path: '/product/barcode',
    exact: true,
    name: 'In mã vạch hàng hóa - vật tư',
    function: 'MD_PRODUCT_ADD',
    component: ProductBarcode,
  },
];

export default product;
