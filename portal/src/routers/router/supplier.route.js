import React from 'react';

const SupplierAddPage = React.lazy(() => import('pages/Supplier/SupplierAddPage'));
const SupplierPage = React.lazy(() => import('pages/Supplier/SupplierPage'));

const supplier = [
  {
    path: '/supplier',
    exact: true,
    name: 'Danh sách nhà cung cấp',
    function: 'SUPPLIER_VIEW',
    component: SupplierPage,
  },
  {
    path: '/supplier/add',
    exact: true,
    name: 'Thêm mới nhà cung cấp',
    function: 'SUPPLIER_ADD',
    component: SupplierAddPage,
  },
  {
    path: '/supplier/edit/:supplier_id',
    exact: true,
    name: 'Chỉnh sửa nhà cung cấp',
    function: 'SUPPLIER_EDIT',
    component: SupplierAddPage,
  },
  {
    path: '/supplier/detail/:supplier_id',
    exact: true,
    name: 'Chi tiết nhà cung cấp',
    function: 'SUPPLIER_VIEW',
    component: SupplierAddPage,
  },
];

export default supplier;
