import React from 'react';
import { PERMISSIONS } from 'pages/OtherAccVoucher/utils/permission';

const DefaultPage = React.lazy(() => import('pages/OtherAccVoucher/pages/ListPage'));
const AddPage = React.lazy(() => import('pages/OtherAccVoucher/pages/AddPage'));
const DetailPage = React.lazy(() => import('pages/OtherAccVoucher/pages/DetailPage'));
const EditPage = React.lazy(() => import('pages/OtherAccVoucher/pages/EditPage'));

const FunctionGroupRoutes = [
  {
    path: '/other-voucher',
    exact: true,
    name: 'Danh sách chứng từ nghiệp vụ khác',
    function: PERMISSIONS.AC_OTHERACCVOUCHER_VIEW,
    component: DefaultPage,
  },
  {
    path: '/other-voucher/add',
    exact: true,
    name: 'Thêm mới chứng từ nghiệp vụ khác',
    function: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
    component: AddPage,
  },
  {
    path: '/other-voucher/detail/:id',
    exact: true,
    name: 'Chi tiết chứng từ nghiệp vụ khác',
    function: PERMISSIONS.AC_OTHERACCVOUCHER_VIEW,
    component: DetailPage,
  },
  {
    path: '/other-voucher/edit/:id',
    exact: true,
    name: 'Chỉnh sửa chứng từ nghiệp vụ khác',
    function: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
    component: EditPage,
  },
];

export default FunctionGroupRoutes;
