import React from 'react';

const BusinessUser = React.lazy(() => import('pages/BusinessUser/BusinessUser'));

const businessUser = [
  {
    path: '/business-user',
    exact: true,
    name: 'Danh sách nhân viên - cửa hàng',
    function: 'SYS_BUSINESS_USER_VIEW',
    component: BusinessUser,
  },
];

export default businessUser;
