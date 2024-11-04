import React from 'react';

// const DenominationPage = React.lazy(() => import('pages/Denomination/DenominationPage'));
const DenominationAddPage = React.lazy(() => import('pages/Denomination/DenominationAddPage'));

const denominationRoutes = [
  // {
  //   path: '/denomination',
  //   exact: true,
  //   name: 'Danh sách mệnh giá',
  //   function: 'MD_DENOMINATIONS_VIEW',
  //   component: DenominationPage,
  // },
  {
    path: '/denomination/add',
    exact: true,
    name: 'Thêm mệnh giá',
    function: 'MD_DENOMINATIONS_ADD',
    component: DenominationAddPage,
  },
  {
    path: '/denomination/edit/:denomination_id',
    exact: true,
    name: 'Chỉnh sửa mệnh giá',
    function: 'MD_DENOMINATIONS_EDIT',
    component: DenominationAddPage,
  },
  {
    path: '/denomination/detail/:denomination_id',
    exact: true,
    name: 'Chi tiết mệnh giá',
    function: 'MD_DENOMINATIONS_VIEW',
    component: DenominationAddPage,
  },
];

export default denominationRoutes;
