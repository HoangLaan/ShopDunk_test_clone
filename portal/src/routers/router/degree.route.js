import React from 'react';

const Degree = React.lazy(() => import('pages/Degree/Degree'));
const DegreeAdd = React.lazy(() => import('pages/Degree/DegreeAdd'));
const DegreeEdit = React.lazy(() => import('pages/Degree/DegreeEdit'));
const DegreeDetail = React.lazy(() => import('pages/Degree/DegreeDetail'));

const degree = [
  {
    path: '/degree',
    exact: true,
    name: 'Danh sách bằng cấp',
    function: 'MD_DEGREE_VIEW',
    component: Degree,
  },
  {
    path: '/degree/add',
    exact: true,
    name: 'Thêm mới bằng cấp',
    function: 'MD_DEGREE_ADD',
    component: DegreeAdd,
  },
  {
    path: '/degree/detail/:id',
    exact: true,
    name: 'Chi tiết bằng cấp',
    function: 'MD_DEGREE_VIEW',
    component: DegreeDetail,
  },
  {
    path: '/degree/edit/:id',
    exact: true,
    name: 'Chỉnh sửa bằng cấp',
    function: 'MD_DEGREE_EDIT',
    component: DegreeEdit,
  },
];

export default degree;
