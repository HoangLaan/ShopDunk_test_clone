import React from 'react';

const InternalTransferPage = React.lazy(() => import('pages/InternalTransfer/InternalTransferPage'));
const InternalTransferAddPage = React.lazy(() => import('pages/InternalTransfer/InternalTransferAddPage'));
const path = '/internal-transfer';
const routers = [
  {
    path: `${path}`,
    exact: true,
    name: 'Danh sách quản lý chuyển tiền nội bộ',
    function: 'SL_INTERNALTRANSFER_VIEW',
    component: InternalTransferPage,
  },
  {
    path: `${path}/add`,
    exact: true,
    name: 'Thêm mới chuyển tiền nội bộ',
    function: 'SL_INTERNALTRANSFER_ADD',
    component: InternalTransferAddPage,
  },
  {
    path: `${path}/detail/:id`,
    exact: true,
    name: 'Chi tiết chuyển tiền nội bộ',
    function: 'SL_INTERNALTRANSFER_VIEW',
    component: InternalTransferAddPage,
  },
  {
    path: `${path}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa chuyển tiền nội bộ',
    function: 'SL_INTERNALTRANSFER_EDIT',
    component: InternalTransferAddPage,
  },
];

export default routers;
