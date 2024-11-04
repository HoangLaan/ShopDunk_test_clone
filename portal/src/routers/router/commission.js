import React from 'react';
import { COMMISSION_PERMISSION } from 'pages/Commission/helpers/constants';

const Commission = React.lazy(() => import('pages/Commission/pages/Commission'));
const CommissionAdd = React.lazy(() => import('pages/Commission/pages/CommissionAdd'));
const CommissionEdit = React.lazy(() => import('pages/Commission/pages/CommissionEdit'));
const CommissionDetail = React.lazy(() => import('pages/Commission/pages/CommissionDetail'));

const commission = [
  {
    path: '/commission',
    exact: true,
    name: 'Danh sách hoa hồng',
    function: COMMISSION_PERMISSION.VIEW,
    component: Commission,
  },
  {
    path: '/commission/add',
    exact: true,
    name: 'Thêm mới hoa hồng',
    function: COMMISSION_PERMISSION.ADD,
    component: CommissionAdd,
  },
  {
    path: '/commission/detail/:id',
    exact: true,
    name: 'Chi tiết hoa hồng',
    function: COMMISSION_PERMISSION.VIEW,
    component: CommissionDetail,
  },
  {
    path: '/commission/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hoa hồng',
    function: COMMISSION_PERMISSION.EDIT,
    component: CommissionEdit,
  },
];

export default commission;
