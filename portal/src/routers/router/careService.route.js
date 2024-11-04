import React from 'react';

const CareServicePage = React.lazy(() => import('pages/CareService/CareServicePage'));
const CareServiceAddPage = React.lazy(() => import('pages/CareService/CareServiceAddPage'));

const careServiceRoute = [
  {
    path: '/care-service',
    exact: true,
    name: 'Danh sách dịch vụ',
    function: 'MD_CARESERVICE_VIEW',
    component: CareServicePage,
  },
  {
    path: '/care-service/add',
    exact: true,
    name: 'Thêm mới dịch vụ',
    function: 'MD_CARESERVICE_ADD',
    component: CareServiceAddPage,
  },
  {
    path: '/care-service/detail/:care_service_code',
    exact: true,
    name: 'Chi tiết dịch vụ',
    function: 'MD_CARESERVICE_VIEW',
    component: CareServiceAddPage,
  },
  {
    path: '/care-service/edit/:care_service_code',
    exact: true,
    name: 'Chỉnh sửa dịch vụ',
    function: 'MD_CARESERVICE_EDIT',
    component: CareServiceAddPage,
  },
];

export default careServiceRoute;
