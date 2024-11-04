import React from 'react';

const GroupServicePage = React.lazy(() => import('pages/GroupService/GroupServicePage'));
const GroupServiceAddPage = React.lazy(() => import('pages/GroupService/GroupServiceAddPage'));

const groupServiceRoute = [
  {
    path: '/group-service',
    exact: true,
    name: 'Danh sách nhóm dịch vụ',
    function: 'MD_GROUPSERVICE_VIEW',
    component: GroupServicePage,
  },
  {
    path: '/group-service/add',
    exact: true,
    name: 'Thêm mới nhóm dịch vụ',
    function: 'MD_GROUPSERVICE_ADD',
    component: GroupServiceAddPage,
  },
  {
    path: '/group-service/detail/:group_service_code',
    exact: true,
    name: 'Chi tiết nhóm dịch vụ',
    function: 'MD_GROUPSERVICE_VIEW',
    component: GroupServiceAddPage,
  },
  {
    path: '/group-service/edit/:group_service_code',
    exact: true,
    name: 'Chỉnh sửa nhóm dịch vụ',
    function: 'MD_GROUPSERVICE_EDIT',
    component: GroupServiceAddPage,
  },
];

export default groupServiceRoute;
