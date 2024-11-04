import React from 'react';

const ProductAttributePage = React.lazy(() => import('pages/ProductAttribute/ProductAttributePage'));
const ProductAttributeAddPage = React.lazy(() => import('pages/ProductAttribute/ProductAttributeAddPage'));

const productAttribute = [
  {
    path: '/product-attribute',
    exact: true,
    name: 'Danh sách thuộc tính sản phẩm',
    function: 'PRO_PRODUCTATTRIBUTE_VIEW',
    component: ProductAttributePage,
  },
  {
    path: '/product-attribute/add',
    exact: true,
    name: 'Thêm mới thuộc tính',
    function: 'PRO_PRODUCTATTRIBUTE_ADD',
    component: ProductAttributeAddPage,
  },
  {
    path: '/product-attribute/edit/:id',
    exact: true,
    name: 'Chỉnh sửa thuộc tính',
    function: 'PRO_PRODUCTATTRIBUTE_EDIT',
    component: ProductAttributeAddPage,
  },
  {
    path: '/product-attribute/detail/:id',
    exact: true,
    name: 'Chi tiết thuộc tính',
    function: 'PRO_PRODUCTATTRIBUTE_VIEW',
    component: ProductAttributeAddPage,
  },
];

export default productAttribute;
