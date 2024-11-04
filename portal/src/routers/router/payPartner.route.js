import React from 'react';

const PayPartnerAddPage = React.lazy(() => import('pages/PayPartner/PayPartnerAddPage'));
const PayPartnerPage = React.lazy(() => import('pages/PayPartner/PayPartnerPage'));

const payPartner = [
  {
    path: '/pay-partner',
    exact: true,
    name: 'Danh sách đối tác thanh toán',
    function: 'MD_PAYPARTNER_VIEW',
    component: PayPartnerPage,
  },
  {
    path: '/pay-partner/add',
    exact: true,
    name: 'Thêm mới đối tác thanh toán',
    function: 'MD_PAYPARTNER_ADD',
    component: PayPartnerAddPage,
  },
  {
    path: '/pay-partner/edit/:pay_partner_id',
    exact: true,
    name: 'Chỉnh sửa đối tác thanh toán',
    function: 'MD_PAYPARTNER_EDIT',
    component: PayPartnerAddPage,
  },
  {
    path: '/pay-partner/detail/:pay_partner_id',
    exact: true,
    name: 'Chi tiết đối tác thanh toán',
    function: 'MD_PAYPARTNER_VIEW',
    component: PayPartnerAddPage,
  },
];

export default payPartner;
