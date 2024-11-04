import React from 'react';

const ProductCategory = React.lazy(() => import('pages/ProductCategory/ProductCategory'));
const ProductCategoryAdd = React.lazy(() => import('pages/ProductCategory/ProductCategoryAdd'));

const productCategory = [
  {
    path: '/product-category',
    exact: true,
    name: 'Danh sách ngành hàng',
    function: 'MD_PRODUCTCATEGORY_VIEW',
    component: ProductCategory,
  },
  {
    path: '/product-category/add',
    exact: true,
    name: 'Thêm mới ngành hàng',
    function: 'MD_PRODUCTCATEGORY_ADD',
    component: ProductCategoryAdd,
  },
  {
    path: '/product-category/edit/:product_category_id',
    exact: true,
    name: 'Chỉnh sửa ngành hàng',
    function: 'MD_PRODUCTCATEGORY_EDIT',
    component: ProductCategoryAdd,
  },
  {
    path: '/product-category/detail/:product_category_id',
    exact: true,
    name: 'Chi tiết ngành hàng',
    function: 'MD_PRODUCTCATEGORY_VIEW',
    component: ProductCategoryAdd,
  },
];

export default productCategory;
