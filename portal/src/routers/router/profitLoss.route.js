import React from 'react';
import { PROFIT_LOSS_PERMISSION } from 'pages/ProfitLoss/utils/constants';

const ProfitLoss = React.lazy(() => import('pages/ProfitLoss/pages/ProfitLoss'));

const profitLossRoute = [
  {
    path: '/profit-loss',
    exact: true,
    name: 'Bảng tính lãi lỗ model',
    function: PROFIT_LOSS_PERMISSION.VIEW,
    component: ProfitLoss,
  },
];

export default profitLossRoute;
