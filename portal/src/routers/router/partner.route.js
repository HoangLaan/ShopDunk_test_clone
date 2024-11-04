import React from 'react';

const PartnerAddPage = React.lazy(() => import('pages/Partner/PartnerAddPage'));
const PartnerPage = React.lazy(() => import('pages/Partner/PartnerPage'));

const partner = [
  {
    path: '/partner',
    exact: true,
    name: 'Danh sách khách hàng doanh nghiệp',
    function: 'CRM_PARTNER_VIEW',
    component: PartnerPage,
  },
  {
    path: '/partner/add',
    exact: true,
    name: 'Thêm mới khách hàng doanh nghiệp',
    function: 'CRM_PARTNER_ADD',
    component: PartnerAddPage,
  },
  {
    path: '/partner/edit/:partner_id',
    exact: true,
    name: 'Chỉnh sửa khách hàng doanh nghiệp',
    function: 'CRM_PARTNER_EDIT',
    component: PartnerAddPage,
  },
  {
    path: '/partner/detail/:partner_id',
    exact: true,
    name: 'Chi tiết khách hàng doanh nghiệp',
    function: 'CRM_PARTNER_VIEW',
    component: PartnerAddPage,
  },
];

export default partner;
