import React from 'react';

const DepartmentAddPage = React.lazy(() => import('pages/Department/DepartmentAddPage'));
const DepartmentPage = React.lazy(() => import('pages/Department/DepartmentPage'));

const departmentRoute = [
  {
    path: '/department',
    exact: true,
    name: 'Danh sách phòng ban',
    function: 'MD_DEPARTMENT_VIEW',
    component: DepartmentPage,
  },
  {
    path: '/department/add',
    exact: true,
    name: 'Thêm mới phòng ban',
    function: 'MD_DEPARTMENT_ADD',
    component: DepartmentAddPage,
  },
  {
    path: '/department/detail/:department_id',
    exact: true,
    name: 'Chi tiết phòng ban',
    function: 'MD_DEPARTMENT_VIEW',
    component: DepartmentAddPage,
  },
  {
    path: '/department/edit/:department_id',
    exact: true,
    name: 'Chỉnh sửa phòng ban',
    function: 'MD_DEPARTMENT_EDIT',
    component: DepartmentAddPage,
  },
];

export default departmentRoute;
