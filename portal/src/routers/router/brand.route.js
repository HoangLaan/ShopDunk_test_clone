import React from 'react';

const Brand = React.lazy(() => import('pages/Brand/Brand'));
const BrandAdd = React.lazy(() => import('pages/Brand/BrandAdd'));
const BrandEdit = React.lazy(() => import('pages/Brand/BrandEdit'));
const BrandDetail = React.lazy(() => import('pages/Brand/BrandDetail'));

const brand = [
  {
    path: '/brand',
    exact: true,
    name: 'Danh sách thương hiệu',
    function: 'MD_BRAND_VIEW',
    component: Brand,
  },
  {
    path: '/brand/add',
    exact: true,
    name: 'Thêm mới thương hiệu',
    function: 'MD_BRAND_ADD',
    component: BrandAdd,
  },
  {
    path: '/brand/edit/:brand_id',
    exact: true,
    name: 'Chỉnh sửa thương hiệu',
    function: 'MD_BRAND_EDIT',
    component: BrandEdit,
  },
  {
    path: '/brand/detail/:brand_id',
    exact: true,
    name: 'Chi tiết thương hiệu',
    function: 'MD_BRAND_VIEW',
    component: BrandDetail,
  },
];

export default brand;
