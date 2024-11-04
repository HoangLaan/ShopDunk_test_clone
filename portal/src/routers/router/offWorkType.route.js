import React from 'react';

const OffWorkType = React.lazy(() => import('pages/OffWorkType/pages/OffWorkTypePage'));
const OffWorkTypeEdit = React.lazy(() => import('pages/OffWorkType/pages/OffWorkTypeEdit'));
const OffWorkTypeAdd = React.lazy(() => import('pages/OffWorkType/pages/OffWorkTypeAdd'));
const OffWorkTypeDetail = React.lazy(() => import('pages/OffWorkType/pages/OffWorkTypeDetail'));

const OffWorkTypeRoutes = [
  {
    path: '/off-work-type',
    exact: true,
    name: 'Danh sách loại nghỉ phép',
    function: 'HR_OFFWORKTYPE_VIEW',
    component: OffWorkType,
  },
  {
    path: '/off-work-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại nghỉ phép',
    function: 'HR_OFFWORKTYPE_EDIT',
    component: OffWorkTypeEdit,
  },
  {
    path: '/off-work-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại nghỉ phép',
    function: 'HR_OFFWORKTYPE_VIEW',
    component: OffWorkTypeDetail,
  },
  {
    path: '/off-work-type/add',
    exact: true,
    name: 'Thêm mới loại nghỉ phép',
    function: 'HR_OFFWORKTYPE_ADD',
    component: OffWorkTypeAdd,
  },
];

export default OffWorkTypeRoutes;
