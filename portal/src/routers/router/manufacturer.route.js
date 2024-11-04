import React from 'react';
import { MANUFACTURER_PERMISSION } from 'pages/Manufacturer/utils/constants';

const ManufacturerAddPage = React.lazy(() => import('pages/Manufacturer/ManufacturerAddPage'));
const ManufacturerPage = React.lazy(() => import('pages/Manufacturer/ManufacturerPage'));

const manufacturerRoute = [
  {
    path: '/manufacturer',
    exact: true,
    name: 'Danh sách hãng',
    function: MANUFACTURER_PERMISSION.VIEW,
    component: ManufacturerPage,
  },
  {
    path: '/manufacturer/add',
    exact: true,
    name: 'Thêm mới hãng',
    function: MANUFACTURER_PERMISSION.ADD,
    component: ManufacturerAddPage,
  },
  {
    path: '/manufacturer/edit/:manufacturer_id',
    exact: true,
    name: 'Chỉnh sửa hãng',
    function: MANUFACTURER_PERMISSION.EDIT,
    component: ManufacturerAddPage,
  },
  {
    path: '/manufacturer/detail/:manufacturer_id',
    exact: true,
    name: 'Chi tiết hãng',
    function: MANUFACTURER_PERMISSION.VIEW,
    component: ManufacturerAddPage,
  },
];

export default manufacturerRoute;
