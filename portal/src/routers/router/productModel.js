import React from 'react';

const ProductModel = React.lazy(() => import('pages/ProductModel/ProductModel'));
const ProductModelAdd = React.lazy(() => import('pages/ProductModel/ProductModelAdd'));

const productModel = [
  {
    path: '/product-model',
    exact: true,
    name: 'Danh sách model',
    function: 'MD_PRODUCTMODEL_VIEW',
    component: ProductModel,
  },
  {
    path: '/product-model/add',
    exact: true,
    name: 'Thêm mới model',
    function: 'MD_PRODUCTMODEL_ADD',
    component: ProductModelAdd,
  },
  {
    path: '/product-model/edit/:product_model_id',
    exact: true,
    name: 'Chỉnh sửa model',
    function: 'MD_PRODUCTMODEL_EDIT',
    component: ProductModelAdd,
  },
  {
    path: '/product-model/detail/:product_model_id',
    exact: true,
    name: 'Chi tiết model',
    function: 'MD_PRODUCTMODEL_VIEW',
    component: ProductModelAdd,
  },
  {
    path: '/product-model/add/:product_model_id',
    exact: true,
    name: 'Sao chép model',
    function: 'MD_PRODUCTMODEL_ADD',
    component: ProductModelAdd,
  },
];

export default productModel;
