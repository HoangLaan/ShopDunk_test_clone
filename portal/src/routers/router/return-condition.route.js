import React from 'react';
import { PERMISSION } from 'pages/ReturnCondition/utils/constants';

const ReturnCondition = React.lazy(() => import('pages/ReturnCondition/pages/ReturnCondition'));

const ReturnConditionAdd = React.lazy(() => import('pages/ReturnCondition/pages/ReturnConditionAdd'));

const ReturnConditionEdit = React.lazy(() => import('pages/ReturnCondition/pages/ReturnConditionEdit'));
const ReturnConditionDetail = React.lazy(() => import('pages/ReturnCondition/pages/ReturnConditionDetail'));

const returnConditionRoute = [
  {
    path: '/return-condition',
    exact: true,
    name: 'Danh sách Điều kiện đổi trả',
    function: PERMISSION.VIEW,
    component: ReturnCondition,
  },
  {
    path: '/return-condition/add',
    exact: true,
    name: 'THÊM MỚI ĐIỀU KIỆN ĐỔI TRẢ',
    function: PERMISSION.ADD,
    component: ReturnConditionAdd,
  },
  {
    path: '/return-condition/edit/:id',
    exact: true,
    name: 'Sửa thông tin trao đổi',
    function: PERMISSION.EDIT,
    component: ReturnConditionEdit,
  },
  {
    path: '/return-condition/detail/:id',
    exact: true,
    name: 'Xem Chi tiết điều kiện đổi trả',
    function: PERMISSION.VIEW,
    component: ReturnConditionDetail,
  },
];

export default returnConditionRoute;
