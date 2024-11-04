import React from 'react';

const StoreTypePage = React.lazy(() => import('pages/StoreType/StoreTypePage'));
const StoreTypeAddPage = React.lazy(() => import('pages/StoreType/StoreTypeAddPage'));

const storeType = [
  {
    path: '/store-type',
    exact: true,
    name: 'Danh sách loại cửa hàng ',
    function: 'MD_STORETYPE_VIEW',
    component: StoreTypePage,
  },
  {
    path: '/store-type/add',
    exact: true,
    name: 'Thêm mới loại cửa hàng',
    function: 'MD_STORETYPE_ADD',
    component: StoreTypeAddPage,
  },
  {
    path: '/store-type/detail/:store_type_id',
    exact: true,
    name: 'Chi tiết loại cửa hàng',
    function: 'MD_STORETYPE_VIEW',
    component: StoreTypeAddPage,
  },
  {
    path: '/store-type/edit/:store_type_id',
    exact: true,
    name: 'Chỉnh sửa loại cửa hàng',
    function: 'MD_STORETYPE_EDIT',
    component: StoreTypeAddPage,
  },
];

export default storeType;
