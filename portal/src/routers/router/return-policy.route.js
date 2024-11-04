import React from 'react';

const ReturnPolicyPage = React.lazy(() => import('pages/ReturnPolicy/ReturnPolicyPage'));
const ReturnPolicyAddPage = React.lazy(() => import('pages/ReturnPolicy/ReturnPolicyAddPage'));

const returnPolicyRoute = [
  {
    path: '/return-policy',
    exact: true,
    name: 'Danh sách chính sách',
    function: 'RETURNPOLICY_VIEW',
    component: ReturnPolicyPage,
  },
  {
    path: '/return-policy/add',
    exact: true,
    name: 'Thêm chính sách trả/đổi hàng',
    function: 'RETURNPOLICY_ADD',
    component: ReturnPolicyAddPage,
  },
  {
    path: '/return-policy/edit/:id',
    exact: true,
    name: 'Chỉnh sửa chính sách',
    function: 'RETURNPOLICY_EDIT',
    component: ReturnPolicyAddPage,
  },
  {
    path: '/return-policy/detail/:id',
    exact: true,
    name: 'Chi tiết chính sách',
    function: 'RETURNPOLICY_VIEW',
    component: ReturnPolicyAddPage,
  },
];

export default returnPolicyRoute;
