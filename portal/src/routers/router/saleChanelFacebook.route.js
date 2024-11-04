import React from 'react';

const SaleChannelFacebook = React.lazy(() => import('pages/SaleChannelFacebook/SaleChannelFacebook'));

const saleChannelRoutes = [
  {
    path: '/sale-channel-facebook',
    exact: true,
    name: 'Kênh bán hàng Facebook',
    function: 'SC_SALECHANNEL_FACEBOOK',
    component: SaleChannelFacebook,
  },
];

export default saleChannelRoutes;
